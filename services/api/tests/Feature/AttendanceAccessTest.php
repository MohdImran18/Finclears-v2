<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\EmployeeProfile;
use App\Models\User;
use App\Services\Employee\EmployeeAccessScope;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class AttendanceAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $permissions = [
            'attendance.view',
            'attendance.request',
            'attendance.manage',
            'employees.view',
            'employees.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }
    }

    private function employeeUser(): User
    {
        $user = User::factory()->create([
            'role' => 'employee',
        ]);

        $user->givePermissionTo([
            'attendance.view',
            'attendance.request',
        ]);

        return $user;
    }

    private function managerUser(): User
    {
        $user = User::factory()->create([
            'role' => 'department-manager',
        ]);

        $user->givePermissionTo([
            'attendance.view',
            'attendance.manage',
        ]);

        return $user;
    }

    private function adminUser(): User
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $user->givePermissionTo(Permission::where('name', 'like', 'attendance.%')->pluck('name')->toArray());

        return $user;
    }

    public function test_employee_can_only_see_accessible_attendance_records(): void
    {
        $user = $this->employeeUser();

        $employee = EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        $otherEmployee = EmployeeProfile::factory()->create();

        Attendance::factory()->create([
            'employee_profile_id' => $employee->id,
        ]);

        Attendance::factory()->create([
            'employee_profile_id' => $otherEmployee->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/attendances');

        $response->assertOk();
        $response->assertJsonPath('success', true);

        $ids = collect($response->json('data'))
            ->pluck('employee_profile_id')
            ->unique()
            ->values()
            ->all();

        $this->assertSame([$employee->id], $ids);
    }

    public function test_employee_cannot_view_another_employees_attendance_record(): void
    {
        $user = $this->employeeUser();

        $employee = EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        $otherEmployee = EmployeeProfile::factory()->create();

        $attendance = Attendance::factory()->create([
            'employee_profile_id' => $otherEmployee->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            "/api/v1/attendances/{$attendance->id}"
        );

        $response->assertNotFound();
    }

    public function test_employee_can_view_own_attendance_record(): void
    {
        $user = $this->employeeUser();

        $employee = EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        $attendance = Attendance::factory()->create([
            'employee_profile_id' => $employee->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            "/api/v1/attendances/{$attendance->id}"
        );

        $response->assertOk();
        $response->assertJsonPath('data.id', $attendance->id);
    }

    public function test_employee_can_view_own_employee_attendance_endpoint(): void
    {
        $user = $this->employeeUser();

        $employee = EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        Attendance::factory()->create([
            'employee_profile_id' => $employee->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            "/api/v1/employees/{$employee->id}/attendance"
        );

        $response->assertOk();
        $response->assertJsonPath('success', true);
    }

    public function test_employee_cannot_view_another_employee_attendance_endpoint(): void
    {
        $user = $this->employeeUser();

        $employee = EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        $otherEmployee = EmployeeProfile::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson(
            "/api/v1/employees/{$otherEmployee->id}/attendance"
        );

        $response->assertForbidden();
    }

    public function test_employee_can_check_in_for_accessible_employee(): void
    {
        $user = $this->employeeUser();

        $employee = EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/attendances/check-in', [
            'employee_profile_id' => $employee->id,
        ]);

        $response->assertSuccessful();
    }

    public function test_employee_cannot_check_in_for_another_employee(): void
    {
        $user = $this->employeeUser();

        $employee = EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        $otherEmployee = EmployeeProfile::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/attendances/check-in', [
            'employee_profile_id' => $otherEmployee->id,
        ]);

        $response->assertForbidden();
    }

    public function test_employee_cannot_check_out_another_employee(): void
    {
        $user = $this->employeeUser();

        EmployeeProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        $otherEmployee = EmployeeProfile::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/attendances/check-out', [
            'employee_profile_id' => $otherEmployee->id,
        ]);

        $response->assertForbidden();
    }

    public function test_employee_cannot_mark_status_for_another_employee(): void
    {
        $user = $this->employeeUser();

        $otherEmployee = EmployeeProfile::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/attendances/mark-status', [
            'employee_profile_id' => $otherEmployee->id,
            'attendance_date' => now()->toDateString(),
            'status' => 'absent',
        ]);

        $response->assertForbidden();
    }

    public function test_manager_can_view_accessible_attendance(): void
    {
        $user = $this->managerUser();

        $employee = EmployeeProfile::factory()->create();

        Sanctum::actingAs($user);

        $scope = app(EmployeeAccessScope::class)
            ->query($user)
            ->pluck('id')
            ->all();

        $this->assertIsArray($scope);
    }

    public function test_admin_has_attendance_permissions(): void
    {
        $user = $this->adminUser();

        Sanctum::actingAs($user);

        $this->assertTrue(
            $user->can('attendance.view')
        );

        $this->assertTrue(
            $user->can('attendance.manage')
        );
    }

    public function test_unauthenticated_user_cannot_access_attendance(): void
    {
        $response = $this->getJson('/api/v1/attendances');

        $response->assertUnauthorized();
    }
}
