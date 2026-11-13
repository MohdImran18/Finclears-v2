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

        // Admin and Super Admin have unrestricted employee access.
        if (
            in_array($user->role, [
                User::ROLE_ADMIN,
                User::ROLE_SUPER_ADMIN,
            ], true) ||
            $user->hasRole('super-admin')
        ) {
            return $query;
        }

        // Finance Manager retains unrestricted employee access.
        if ($user->hasRole('finance-manager')) {
            return $query;
        }

        // HR Manager, HR Executive, Team Lead and Department Manager
        // can access only their own profile and assigned reporting tree.
        if (
            $user->hasRole('hr-manager') ||
            $user->hasRole('hr-executive') ||
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
