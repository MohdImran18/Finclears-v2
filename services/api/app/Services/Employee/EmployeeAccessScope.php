<?php

namespace App\Services\Employee;

use App\Models\EmployeeProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class EmployeeAccessScope
{
    /**
     * Return the employee profiles the current user is allowed to access.
     *
     * Rules:
     * - admin: all employees
     * - hr-manager / finance-manager / department-manager:
     *   currently all employees within their permitted module scope
     * - team-lead: own profile + complete reporting tree
     * - employee: own profile only
     */
    public function query(User $user): Builder
    {
        $query = EmployeeProfile::query();

        // Admin has unrestricted employee access.
        if ($user->role === User::ROLE_ADMIN) {
            return $query;
        }

        // HR/Finance managers are not restricted to one reporting tree.
        // Module-level permissions should control what they can actually use.
        if (
            $user->hasRole('hr-manager') ||
            $user->hasRole('finance-manager')
        ) {
            return $query;
        }

        // Team leads and department managers see their reporting tree.
        if (
            $user->hasRole('team-lead') ||
            $user->hasRole('department-manager')
        ) {
            $userIds = $this->getTeamUserIds($user->id);

            return $query->whereIn('user_id', $userIds);
        }

        // Normal employee: own profile only.
        return $query->where('user_id', $user->id);
    }

    /**
     * Get the current user's complete reporting tree.
     *
     * reporting_manager_id stores the User ID of the manager.
     */
    public function getTeamUserIds(int $managerUserId): array
    {
        $userIds = [$managerUserId];
        $pending = [$managerUserId];

        while (!empty($pending)) {
            $managerId = array_shift($pending);

            $childIds = EmployeeProfile::query()
                ->where('reporting_manager_id', $managerId)
                ->pluck('user_id')
                ->map(fn ($id) => (int) $id)
                ->all();

            foreach ($childIds as $childId) {
                if (!in_array($childId, $userIds, true)) {
                    $userIds[] = $childId;
                    $pending[] = $childId;
                }
            }
        }

        return $userIds;
    }

    /**
     * Check whether a user can access a particular employee profile.
     */
    public function canAccess(
        User $user,
        EmployeeProfile $employee
    ): bool {
        return $this->query($user)
            ->whereKey($employee->id)
            ->exists();
    }
}
