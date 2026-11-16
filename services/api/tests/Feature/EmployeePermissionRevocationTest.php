<?php

namespace Tests\Feature;

use App\Models\EmployeeMonitoringAuditEvent;
use App\Models\EmployeeMonitoringSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeePermissionRevocationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'employee-monitoring.policy_version' => 'v1',
            'employee-monitoring.timezone' => 'Asia/Kolkata',
        ]);
    }

    private function employee(): User
    {
        return User::factory()->employee()->create();
    }

    private function employeeToken(User $user): string
    {
        return $user->createToken(
            'employee-revocation-test',
            ['employee-consent', 'employee-portal']
        )->plainTextToken;
    }

    private function createSession(
        User $employee,
        string $status
    ): EmployeeMonitoringSession {
        return EmployeeMonitoringSession::query()->create([
            'employee_user_id' => $employee->id,
            'requester_user_id' => User::factory()->admin()->create()->id,
            'status' => $status,
            'requested_at' => now(),
            'responded_at' => $status === 'accepted' ? now() : null,
            'expires_at' => now()->addMinutes(5),
            'started_at' => $status === 'accepted' ? now() : null,
        ]);
    }

    public function test_permission_revocation_ends_sessions_and_revokes_all_employee_tokens(): void
    {
        $employee = $this->employee();
        $token = $this->employeeToken($employee);

        $accepted = $this->createSession($employee, 'accepted');
        $pending = $this->createSession($employee, 'pending');

        // Create a second token to verify that every employee token is revoked.
        $employee->createToken('another-employee-token', ['employee-portal']);

        $response = $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/permission-revoked',
            ['permission' => 'camera']
        );

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('code', 'EMPLOYEE_PERMISSION_REVOKED');

        $this->assertDatabaseHas('employee_monitoring_sessions', [
            'id' => $accepted->id,
            'status' => 'ended',
        ]);

        $this->assertDatabaseHas('employee_monitoring_sessions', [
            'id' => $pending->id,
            'status' => 'cancelled',
        ]);

        $this->assertSame(0, $employee->fresh()->tokens()->count());

        $sessionAudit = EmployeeMonitoringAuditEvent::query()
            ->where('employee_user_id', $employee->id)
            ->where('event', 'session_ended_by_permission_revocation')
            ->get();

        $this->assertCount(2, $sessionAudit);

        $acceptedAudit = $sessionAudit->first(
            fn ($event) => ($event->metadata['session_id'] ?? null) === $accepted->id
        );

        $pendingAudit = $sessionAudit->first(
            fn ($event) => ($event->metadata['session_id'] ?? null) === $pending->id
        );

        $this->assertSame('accepted', $acceptedAudit->metadata['previous_status']);
        $this->assertSame('pending', $pendingAudit->metadata['previous_status']);
        $this->assertSame('camera', $acceptedAudit->metadata['permission']);

        $this->assertDatabaseHas('employee_monitoring_audit_events', [
            'employee_user_id' => $employee->id,
            'event' => 'employee_logged_out_by_permission_revocation',
            'policy_version' => 'v1',
        ]);
    }

    public function test_another_employees_tokens_and_sessions_are_not_affected(): void
    {
        $employee = $this->employee();
        $otherEmployee = $this->employee();

        $token = $this->employeeToken($employee);
        $otherToken = $this->employeeToken($otherEmployee);

        $otherSession = $this->createSession($otherEmployee, 'accepted');

        $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/permission-revoked',
            ['permission' => 'microphone']
        )->assertOk();

        $this->assertSame(0, $employee->fresh()->tokens()->count());
        $this->assertSame(1, $otherEmployee->fresh()->tokens()->count());

        $this->assertDatabaseHas('employee_monitoring_sessions', [
            'id' => $otherSession->id,
            'status' => 'accepted',
        ]);
    }

    public function test_invalid_permission_does_not_revoke_employee_tokens(): void
    {
        $employee = $this->employee();
        $token = $this->employeeToken($employee);

        $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/permission-revoked',
            ['permission' => 'screen']
        )->assertUnprocessable();

        $this->assertSame(1, $employee->fresh()->tokens()->count());
    }

    public function test_non_employee_cannot_use_permission_revocation_endpoint(): void
    {
        $admin = User::factory()->admin()->create();

        $token = $admin->createToken('admin-test-token', ['*'])->plainTextToken;

        $this->withToken($token)->postJson(
            '/api/v1/auth/employee-consent/permission-revoked',
            ['permission' => 'camera']
        )->assertForbidden();

        $this->assertSame(1, $admin->fresh()->tokens()->count());
    }
}
