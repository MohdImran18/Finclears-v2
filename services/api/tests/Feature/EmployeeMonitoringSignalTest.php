<?php

namespace Tests\Feature;

use App\Events\EmployeeMonitoringSignal;
use App\Models\EmployeeDailyConsent;
use App\Models\EmployeeMonitoringSession;
use App\Models\EmployeeProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class EmployeeMonitoringSignalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'employee-monitoring.policy_version' => 'v1',
            'employee-monitoring.timezone' => 'Asia/Kolkata',
            'employee-monitoring.policy_approved' => true,
            'employee-monitoring.policy_text' => 'Monitoring policy test.',
        ]);
    }

    private function manager(): array
    {
        $role = Role::firstOrCreate([
            'name' => 'finance-manager',
            'guard_name' => 'sanctum',
        ]);

        $permission = Permission::firstOrCreate([
            'name' => 'monitoring.view',
            'guard_name' => 'sanctum',
        ]);

        $role->givePermissionTo($permission);

        $user = User::factory()->create();
        $user->assignRole($role);

        return [
            $user,
            $user->createToken('signal-manager', ['*'])->plainTextToken,
        ];
    }

    private function employee(): User
    {
        $employee = User::factory()->employee()->create();

        EmployeeProfile::factory()->create([
            'user_id' => $employee->id,
        ]);

        EmployeeDailyConsent::query()->create([
            'user_id' => $employee->id,
            'work_date' => now('Asia/Kolkata')->toDateString(),
            'policy_version' => 'v1',
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        return $employee;
    }

    private function employeeToken(User $employee): string
    {
        return $employee->createToken(
            'signal-employee',
            ['employee-consent', 'employee-portal']
        )->plainTextToken;
    }

    private function acceptedSession(User $employee, User $manager): EmployeeMonitoringSession
    {
        return EmployeeMonitoringSession::query()->create([
            'employee_user_id' => $employee->id,
            'requester_user_id' => $manager->id,
            'status' => 'accepted',
            'requested_at' => now(),
            'responded_at' => now(),
            'expires_at' => now()->addMinutes(5),
            'started_at' => now(),
        ]);
    }

    public function test_employee_can_send_offer_for_own_accepted_session(): void
    {
        [$manager] = $this->manager();
        $employee = $this->employee();
        $token = $this->employeeToken($employee);
        $session = $this->acceptedSession($employee, $manager);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($token)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'offer',
                'payload' => ['sdp' => 'test-sdp-offer'],
            ]
        )->assertStatus(202)
            ->assertJsonPath('success', true);

        Event::assertDispatched(
            EmployeeMonitoringSignal::class,
            fn ($event) =>
                $event->sessionId === $session->id
                && $event->senderId === $employee->id
                && $event->signalType === 'offer'
        );
    }

    public function test_original_requester_can_send_answer_for_accepted_session(): void
    {
        [$manager, $managerToken] = $this->manager();
        $employee = $this->employee();
        $session = $this->acceptedSession($employee, $manager);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($managerToken)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'answer',
                'payload' => ['sdp' => 'test-sdp-answer'],
            ]
        )->assertStatus(202);

        Event::assertDispatched(
            EmployeeMonitoringSignal::class,
            fn ($event) =>
                $event->sessionId === $session->id
                && $event->senderId === $manager->id
                && $event->signalType === 'answer'
        );
    }

    public function test_unrelated_manager_cannot_send_signal_to_another_requesters_session(): void
    {
        [$manager] = $this->manager();
        [, $otherManagerToken] = $this->manager();

        $employee = $this->employee();
        $session = $this->acceptedSession($employee, $manager);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($otherManagerToken)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'offer',
                'payload' => ['sdp' => 'test-sdp'],
            ]
        )->assertNotFound();

        Event::assertNotDispatched(EmployeeMonitoringSignal::class);
    }

    public function test_pending_session_cannot_exchange_signals(): void
    {
        [$manager] = $this->manager();
        $employee = $this->employee();
        $token = $this->employeeToken($employee);

        $session = EmployeeMonitoringSession::query()->create([
            'employee_user_id' => $employee->id,
            'requester_user_id' => $manager->id,
            'status' => 'pending',
            'requested_at' => now(),
            'expires_at' => now()->addMinutes(5),
        ]);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($token)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'offer',
                'payload' => ['sdp' => 'test-sdp'],
            ]
        )->assertStatus(409);

        Event::assertNotDispatched(EmployeeMonitoringSignal::class);
    }

    public function test_withdrawn_consent_blocks_signaling(): void
    {
        [$manager] = $this->manager();
        $employee = $this->employee();
        $token = $this->employeeToken($employee);
        $session = $this->acceptedSession($employee, $manager);

        EmployeeDailyConsent::query()
            ->where('user_id', $employee->id)
            ->update([
                'status' => 'withdrawn',
                'withdrawn_at' => now(),
            ]);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($token)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'offer',
                'payload' => ['sdp' => 'test-sdp'],
            ]
        )->assertForbidden();

        Event::assertNotDispatched(EmployeeMonitoringSignal::class);
    }

    public function test_invalid_sdp_payload_is_rejected(): void
    {
        [$manager] = $this->manager();
        $employee = $this->employee();
        $token = $this->employeeToken($employee);
        $session = $this->acceptedSession($employee, $manager);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($token)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'offer',
                'payload' => ['sdp' => ['not-a-string']],
            ]
        )->assertStatus(422);

        Event::assertNotDispatched(EmployeeMonitoringSignal::class);
    }


    private function configureTestBroadcaster(): void
    {
        config([
            'broadcasting.default' => 'reverb',
            'broadcasting.connections.reverb' => [
                'driver' => 'reverb',
                'key' => 'test-key',
                'secret' => 'test-secret',
                'app_id' => 'test-app',
                'options' => [
                    'host' => '127.0.0.1',
                    'port' => 8080,
                    'scheme' => 'http',
                    'useTLS' => false,
                ],
                'client_options' => [],
            ],
        ]);

        \Illuminate\Support\Facades\Broadcast::purge('reverb');
        \Illuminate\Support\Facades\Broadcast::setDefaultDriver('reverb');

        require base_path('routes/channels.php');
    }

    private function authorizeMonitoringChannel(
        string $token,
        int $sessionId
    ) {
        return $this->withToken($token)->postJson('/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => "private-employee-monitoring.session.{$sessionId}",
        ]);
    }

    public function test_expired_session_cannot_send_signal(): void
    {
        [$manager] = $this->manager();
        $employee = $this->employee();
        $token = $this->employeeToken($employee);
        $session = $this->acceptedSession($employee, $manager);

        $session->update(['expires_at' => now()->subSecond()]);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($token)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'offer',
                'payload' => ['sdp' => 'test-sdp'],
            ]
        )->assertStatus(409);

        Event::assertNotDispatched(EmployeeMonitoringSignal::class);
    }

    public function test_ended_session_cannot_send_signal(): void
    {
        [$manager] = $this->manager();
        $employee = $this->employee();
        $token = $this->employeeToken($employee);
        $session = $this->acceptedSession($employee, $manager);

        $session->update(['ended_at' => now()]);

        Event::fake([EmployeeMonitoringSignal::class]);

        $this->withToken($token)->postJson(
            "/api/v1/employee-monitoring/sessions/{$session->id}/signal",
            [
                'signal_type' => 'offer',
                'payload' => ['sdp' => 'test-sdp'],
            ]
        )->assertStatus(409);

        Event::assertNotDispatched(EmployeeMonitoringSignal::class);
    }

    public function test_employee_can_authorize_own_valid_monitoring_channel(): void
    {
        $this->configureTestBroadcaster();

        [$manager] = $this->manager();
        $employee = $this->employee();
        $session = $this->acceptedSession($employee, $manager);
        $token = $this->employeeToken($employee);

        $this->authorizeMonitoringChannel($token, $session->id)
            ->assertOk()
            ->assertJsonStructure(['auth']);
    }

    public function test_original_requester_can_authorize_valid_monitoring_channel(): void
    {
        $this->configureTestBroadcaster();

        [$manager, $managerToken] = $this->manager();
        $employee = $this->employee();
        $session = $this->acceptedSession($employee, $manager);

        $this->authorizeMonitoringChannel($managerToken, $session->id)
            ->assertOk()
            ->assertJsonStructure(['auth']);
    }

    public function test_expired_session_channel_authorization_is_denied(): void
    {
        $this->configureTestBroadcaster();

        [$manager] = $this->manager();
        $employee = $this->employee();
        $session = $this->acceptedSession($employee, $manager);
        $token = $this->employeeToken($employee);

        $session->update(['expires_at' => now()->subSecond()]);

        $this->authorizeMonitoringChannel($token, $session->id)
            ->assertForbidden();
    }

    public function test_ended_session_channel_authorization_is_denied(): void
    {
        $this->configureTestBroadcaster();

        [$manager] = $this->manager();
        $employee = $this->employee();
        $session = $this->acceptedSession($employee, $manager);
        $token = $this->employeeToken($employee);

        $session->update(['ended_at' => now()]);

        $this->authorizeMonitoringChannel($token, $session->id)
            ->assertForbidden();
    }

}