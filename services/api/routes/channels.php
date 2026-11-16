<?php

use App\Models\EmployeeDailyConsent;
use App\Models\EmployeeMonitoringSession;
use App\Models\User;
use App\Services\Employee\EmployeeAccessScope;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('employee-monitoring.session.{sessionId}', function ($user, $sessionId) {
    if (!$user->isActive()) {
        return false;
    }

    $session = EmployeeMonitoringSession::query()->find($sessionId);

    if (
        !$session ||
        $session->status !== EmployeeMonitoringSession::STATUS_ACCEPTED
    ) {
        return false;
    }

    $employeeId = (int) $session->employee_user_id;

    $employeeIsActive = User::query()
        ->whereKey($employeeId)
        ->where('role', User::ROLE_EMPLOYEE)
        ->where('status', User::STATUS_ACTIVE)
        ->exists();

    if (!$employeeIsActive) {
        return false;
    }

    $timezone = config('employee-monitoring.timezone', 'Asia/Kolkata');
    $today = now($timezone)->toDateString();

    $hasActiveConsent = EmployeeDailyConsent::query()
        ->where('user_id', $employeeId)
        ->whereDate('work_date', $today)
        ->where('policy_version', config('employee-monitoring.policy_version', 'v1'))
        ->where('status', EmployeeDailyConsent::STATUS_ACCEPTED)
        ->whereNotNull('accepted_at')
        ->whereNull('withdrawn_at')
        ->exists();

    if (!$hasActiveConsent) {
        return false;
    }

    // Employee can join only their own accepted session.
    if ((int) $user->id === $employeeId) {
        return $user->isEmployee();
    }

    // Requesters must have explicit monitoring permission.
    if (!$user->can('monitoring.view')) {
        return false;
    }

    // Only the original requester can join as the other participant.
    if ((int) $user->id !== (int) $session->requester_user_id) {
        return false;
    }

    $allowedRequesterRoles = [
        'admin',
        'super_admin',
        'super-admin',
        'hr-manager',
        'hr-executive',
        'department-manager',
        'team-lead',
        'finance-manager',
    ];

    if (!$user->hasAnyRole($allowedRequesterRoles)) {
        return false;
    }

    // Enforce the same employee visibility scope used by HRM.
    return app(EmployeeAccessScope::class)
        ->query($user)
        ->where('user_id', $employeeId)
        ->exists();
});
