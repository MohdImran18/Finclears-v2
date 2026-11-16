<?php

namespace Tests\Feature;

use App\Models\EmployeeDailyConsent;
use App\Models\EmployeeMonitoringSession;
use App\Models\EmployeeProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class EmployeeMonitoringSessionTest extends TestCase
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
            'employee-monitoring.retention_period' => '30 days',
            'employee-monitoring.support_contact' => 'hr@example.test',
        ]);
    }

    private function manager(): array
    {
        $role = Role::firstOrCreate([
            'name' => 'finance-manager',
            'guard_name' => 'sanctum',
        ]);

        foreach (['monitoring.view', 'monitoring.audit'] as $name) {
            $permission = Permission::firstOrCreate([
                'name' => $name,
                'guard_name' => 'sanctum',
            ]);

            $role->givePermissionTo($permission);
        }

        $user = User::factory()->create();
        $user->assignRole($role);

        return [
            $user,
            $user->createToken('session-manager', ['*'])->plainTextToken,
        ];
    }

    private function employee(): User
    {
        $employee = User::factory()->employee()->create();

        EmployeeProfile::factory()->create([
            'user_id' => $employee->id,
        ]);

        return $employee;
    }

    private function acceptDailyConsent(User $employee): void
    {
        $today = now('Asia/Kolkata')->toDateString();

        $consent = EmployeeDailyConsent::query()
            ->where('user_id', $employee->id)
            ->whereDate('work_date', $today)
            ->where('policy_version', 'v1')
            ->first();

        if ($consent) {
            $consent->update([
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);

            return;
        }

        EmployeeDailyConsent::query()->create([
            'user_id' => $employee->id,
            'work_date' => $today,
            'policy_version' => 'v1',
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);
    }

    private function employeeToken(User $employee): string
    {
        $this->acceptDailyConsent($employee);

        return $employee->createToken(
            'employee-session-test',
            ['employee-consent', 'employee-portal']
        )->plainTextToken;
    }

    private function requestSession(string $managerToken, User $employee): int
    {
        $this->app['auth']->forgetGuards();

        $response = $this->withToken($managerToken)->postJson(
            '/api/v1/employee-monitoring/sessions',
            ['employee_user_id' => $employee->id]
        );

        $response->assertCreated();

        return (int) $response->json('data.id');
    }

    public function test_finance_manager_can_request_but_duplicate_pending_request_is_rejected(): void
    {
        [$manager, $token] = $this->manager();
        $employee = $this->employee();

        $this->acceptDailyConsent($employee);

        $this->requestSession($token, $employee);

        $this->app['auth']->forgetGuards();

        $this->withToken($token)->postJson(
            '/api/v1/employee-monitoring/sessions',
            ['employee_user_id' => $employee->id]
        )->assertStatus(409)
            ->assertJsonPath('code', 'EMPLOYEE_SESSION_ALREADY_ACTIVE');

        $this->assertDatabaseCount('employee_monitoring_sessions', 1);
    }

    public function test_employee_can_accept_and_reject_monitoring_requests(): void
    {
        [$manager, $managerToken] = $this->manager();

        $employeeAccept = $this->employee();
        $employeeReject = $this->employee();

        $this->acceptDailyConsent($employeeAccept);
        $this->acceptDailyConsent($employeeReject);

        $acceptSession = EmployeeMonitoringSession::query()->create([
            'employee_user_id' => $employeeAccept->id,
            'requester_user_id' => $manager->id,
            'status' => EmployeeMonitoringSession::STATUS_PENDING,
            'requested_at' => now(),
            'expires_at' => now()->addMinutes(5),
        ]);

        $rejectSession = EmployeeMonitoringSession::query()->create([
            'employee_user_id' => $employeeReject->id,
            'requester_user_id' => $manager->id,
            'status' => EmployeeMonitoringSession::STATUS_PENDING,
            'requested_at' => now(),
            'expires_at' => now()->addMinutes(5),
        ]);

        $acceptToken = $this->employeeToken($employeeAccept);
        $rejectToken = $this->employeeToken($employeeReject);

        $this->app['auth']->forgetGuards();

        $this->withToken($acceptToken)->postJson(
            "/api/v1/employee-monitoring/sessions/{$acceptSession->id}/respond",
            ['decision' => 'accept']
        )->assertOk()
            ->assertJsonPath('data.status', 'accepted');

        $this->app['auth']->forgetGuards();

        $this->withToken($rejectToken)->postJson(
            "/api/v1/employee-monitoring/sessions/{$rejectSession->id}/respond",
            ['decision' => 'reject']
        )->assertOk()
            ->assertJsonPath('data.status', 'rejected');
    }

    public function test_consent_withdrawal_ends_accepted_and_cancels_pending_sessions(): void
    {
        $employee = $this->employee();
        $token = $this->employeeToken($employee);

        $accepted = EmployeeMonitoringSession::query()->create([
            'employee_user_id' => $employee->id,
            'requester_user_id' => User::factory()->admin()->create()->id,
            'status' => 'accepted',
            'requested_at' => now(),
            'responded_at' => now(),
            'expires_at' => now()->addMinutes(5),
            'started_at' => now(),
        ]);

        $pending = EmployeeMonitoringSession::query()->create([
            'employee_user_id' => $employee->id,
            'requester_user_id' => User::factory()->admin()->create()->id,
            'status' => 'pending',
            'requested_at' => now(),
            'expires_at' => now()->addMinutes(5),
        ]);

        $this->app['auth']->forgetGuards();

        $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/withdraw',
            ['policy_version' => 'v1']
        )->assertOk()
            ->assertJsonPath('data.status', 'withdrawn');

        $this->assertDatabaseHas('employee_monitoring_sessions', [
            'id' => $accepted->id,
            'status' => 'ended',
        ]);

        $this->assertDatabaseHas('employee_monitoring_sessions', [
            'id' => $pending->id,
            'status' => 'cancelled',
        ]);
    }
}