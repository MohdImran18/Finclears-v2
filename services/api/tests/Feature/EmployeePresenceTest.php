<?php

namespace Tests\Feature;

use App\Models\EmployeeDailyConsent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeePresenceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'employee-monitoring.policy_version' => 'v1',
            'employee-monitoring.timezone' => 'Asia/Kolkata',
            'employee-monitoring.policy_approved' => true,
            'employee-monitoring.policy_text' => 'Test policy',
        ]);
    }

    public function test_employee_with_active_consent_can_send_heartbeat(): void
    {
        $user = User::factory()->employee()->create();
        EmployeeDailyConsent::query()->create([
            'user_id' => $user->id,
            'work_date' => now('Asia/Kolkata')->toDateString(),
            'policy_version' => 'v1',
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);
        $token = $user->createToken('presence-test', ['employee-portal'])->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/employee-presence/heartbeat', [
            'status' => 'online',
        ])->assertOk()->assertJsonPath('data.status', 'online');

        $this->assertDatabaseHas('employee_presences', [
            'user_id' => $user->id,
            'status' => 'online',
        ]);
    }

    public function test_employee_without_consent_cannot_send_heartbeat(): void
    {
        $user = User::factory()->employee()->create();
        $token = $user->createToken('presence-test', ['employee-portal'])->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/employee-presence/heartbeat')
            ->assertForbidden();

        $this->assertDatabaseMissing('employee_presences', ['user_id' => $user->id]);
    }
}
