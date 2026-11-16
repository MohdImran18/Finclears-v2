<?php

namespace Tests\Feature;

use App\Models\EmployeeDailyConsent;
use App\Models\EmployeeMonitoringAuditEvent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeDailyConsentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'employee-monitoring.policy_version' => 'v1',
            'employee-monitoring.timezone' => 'Asia/Kolkata',
            'employee-monitoring.policy_approved' => true,
            'employee-monitoring.policy_text' => 'Employee monitoring policy test text.',
            'employee-monitoring.retention_period' => '30 days',
            'employee-monitoring.support_contact' => 'hr@example.test',
        ]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    private function employeeUser(): User
    {
        return User::factory()->employee()->create();
    }

    private function consentToken(User $user): string
    {
        return $user->createToken(
            'employee-consent-test',
            ['employee-consent']
        )->plainTextToken;
    }

    public function test_employee_status_is_pending_without_existing_consent(): void
    {
        $user = $this->employeeUser();
        $token = $this->consentToken($user);

        $response = $this->withToken($token)->getJson(
            '/api/v1/auth/employee-consent/status'
        );

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.policy_version', 'v1')
            ->assertJsonPath('data.policy_available', true);
    }

    public function test_employee_cannot_accept_when_policy_is_not_approved(): void
    {
        config([
            'employee-monitoring.policy_approved' => false,
        ]);

        $user = $this->employeeUser();
        $token = $this->consentToken($user);

        $response = $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/accept',
            ['policy_version' => 'v1']
        );

        $response->assertStatus(409)
            ->assertJsonPath('code', 'POLICY_NOT_APPROVED');

        $this->assertDatabaseMissing('employee_daily_consents', [
            'user_id' => $user->id,
            'policy_version' => 'v1',
        ]);
    }

    public function test_employee_cannot_accept_with_wrong_policy_version(): void
    {
        $user = $this->employeeUser();
        $token = $this->consentToken($user);

        $response = $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/accept',
            ['policy_version' => 'old-version']
        );

        $response->assertStatus(409)
            ->assertJsonPath('code', 'POLICY_VERSION_MISMATCH');
    }

    public function test_employee_can_accept_policy_and_receive_full_access_token(): void
    {
        $user = $this->employeeUser();
        $token = $this->consentToken($user);

        $response = $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/accept',
            ['policy_version' => 'v1']
        );

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'accepted')
            ->assertJsonPath('data.policy_version', 'v1');

        $newToken = $response->json('data.token');

        $this->assertNotEmpty($newToken);

        $this->assertDatabaseHas('employee_daily_consents', [
            'user_id' => $user->id,
            'policy_version' => 'v1',
            'status' => 'accepted',
        ]);

        $this->assertDatabaseHas('employee_monitoring_audit_events', [
            'employee_user_id' => $user->id,
            'event' => 'accepted',
            'policy_version' => 'v1',
        ]);

        $this->app['auth']->forgetGuards();

        $portalResponse = $this->withToken($newToken)->getJson(
            '/api/v1/auth/me'
        );

        $portalResponse->assertOk();
    }

    public function test_declined_consent_does_not_allow_full_portal_access(): void
    {
        $user = $this->employeeUser();
        $token = $this->consentToken($user);

        $response = $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/decline',
            ['policy_version' => 'v1']
        );

        $response->assertOk()
            ->assertJsonPath('data.status', 'declined');

        $restrictedToken = $response->json('data.token');

        $this->assertNotEmpty($restrictedToken);

        $this->assertDatabaseHas('employee_daily_consents', [
            'user_id' => $user->id,
            'policy_version' => 'v1',
            'status' => 'declined',
        ]);

        $this->app['auth']->forgetGuards();

        $portalResponse = $this->withToken($restrictedToken)->getJson(
            '/api/v1/auth/me'
        );

        $portalResponse->assertStatus(403)
            ->assertJsonPath(
                'code',
                'EMPLOYEE_FULL_ACCESS_TOKEN_REQUIRED'
            );
    }

    public function test_employee_can_withdraw_accepted_consent(): void
    {
        $user = $this->employeeUser();
        $token = $this->consentToken($user);

        $acceptResponse = $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/accept',
            ['policy_version' => 'v1']
        );

        $acceptResponse->assertOk();

        $acceptedToken = $acceptResponse->json('data.token');

        $this->app['auth']->forgetGuards();

        $withdrawResponse = $this->withToken($acceptedToken)->postJson(
            '/api/v1/auth/employee-consent/withdraw',
            ['policy_version' => 'v1']
        );

        $withdrawResponse->assertOk()
            ->assertJsonPath('data.status', 'withdrawn');

        $restrictedToken = $withdrawResponse->json('data.token');

        $this->assertNotEmpty($restrictedToken);

        $this->assertDatabaseHas('employee_daily_consents', [
            'user_id' => $user->id,
            'policy_version' => 'v1',
            'status' => 'withdrawn',
        ]);

        $this->assertDatabaseHas('employee_monitoring_audit_events', [
            'employee_user_id' => $user->id,
            'event' => 'withdrawn',
            'policy_version' => 'v1',
        ]);

        $this->app['auth']->forgetGuards();

        $portalResponse = $this->withToken($restrictedToken)->getJson(
            '/api/v1/auth/me'
        );

        $portalResponse->assertStatus(403)
            ->assertJsonPath(
                'code',
                'EMPLOYEE_FULL_ACCESS_TOKEN_REQUIRED'
            );
    }

    public function test_employee_cannot_withdraw_without_active_consent(): void
    {
        $user = $this->employeeUser();
        $token = $this->consentToken($user);

        $response = $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/withdraw',
            ['policy_version' => 'v1']
        );

        $response->assertStatus(409)
            ->assertJsonPath('code', 'NO_ACTIVE_CONSENT');
    }

    public function test_wildcard_token_cannot_access_employee_consent_endpoint(): void
    {
        $user = $this->employeeUser();

        $wildcardToken = $user->createToken(
            'legacy-wildcard-test',
            ['*']
        )->plainTextToken;

        $response = $this->withToken($wildcardToken)->getJson(
            '/api/v1/auth/employee-consent/status'
        );

        $response->assertStatus(403)
            ->assertJsonPath(
                'code',
                'EMPLOYEE_CONSENT_TOKEN_REQUIRED'
            );
    }

    public function test_previous_day_consent_is_pending_after_midnight_ist(): void
    {
        Carbon::setTestNow(
            Carbon::parse('2026-11-14 23:59:00', 'Asia/Kolkata')
        );

        $user = $this->employeeUser();

        EmployeeDailyConsent::create([
            'user_id' => $user->id,
            'work_date' => '2026-11-14',
            'policy_version' => 'v1',
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        Carbon::setTestNow(
            Carbon::parse('2026-11-15 00:01:00', 'Asia/Kolkata')
        );

        $token = $this->consentToken($user);

        $response = $this->withToken($token)->getJson(
            '/api/v1/auth/employee-consent/status'
        );

        $response->assertOk()
            ->assertJsonPath('data.work_date', '2026-11-15')
            ->assertJsonPath('data.status', 'pending');

        // Previous day's acceptance must not grant access after IST midnight.
        $fullAccessToken = $user->createToken(
            'midnight-full-access-test',
            ['employee-consent', 'employee-portal']
        )->plainTextToken;

        $portalResponse = $this->withToken($fullAccessToken)->getJson(
            '/api/v1/auth/me'
        );

        $portalResponse->assertStatus(403)
            ->assertJsonPath('code', 'EMPLOYEE_CONSENT_REQUIRED');
    }

    public function test_admin_and_client_are_not_blocked_by_employee_consent_middleware(): void
    {
        $admin = User::factory()->admin()->create();

        $adminToken = $admin->createToken(
            'admin-test',
            ['*']
        )->plainTextToken;

        $adminResponse = $this->withToken($adminToken)->getJson(
            '/api/v1/auth/me'
        );

        $adminResponse->assertOk();

        $client = User::factory()->client()->create();

        $clientToken = $client->createToken(
            'client-test',
            ['*']
        )->plainTextToken;

        $clientResponse = $this->withToken($clientToken)->getJson(
            '/api/v1/auth/me'
        );

        $clientResponse->assertOk();
    }
}