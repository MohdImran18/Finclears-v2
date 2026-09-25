<?php

namespace App\Services\Payroll;

use App\Models\Attendance;
use Carbon\Carbon;

class AttendancePayrollService
{
    /**
     * Build attendance summary for one employee/month.
     *
     * The supplied period should already represent the employee's
     * payroll-eligible period (for example, joining date through
     * month end).
     */
    public function summarize(
        int $employeeProfileId,
        Carbon $periodStart,
        Carbon $periodEnd
    ): array {
        if ($periodStart->gt($periodEnd)) {
            return [
                'working_days' => 0.0,
                'present_days' => 0.0,
                'leave_days' => 0.0,
                'lop_days' => 0.0,
            ];
        }

        $records = Attendance::query()
            ->where('employee_profile_id', $employeeProfileId)
            ->whereBetween('attendance_date', [
                $periodStart->toDateString(),
                $periodEnd->toDateString(),
            ])
            ->get();

        $workingDays = $periodStart->copy()->startOfDay()->diffInDays($periodEnd->copy()->startOfDay()) + 1;

        $presentDays = 0.0;
        $leaveDays = 0.0;
        $lopDays = 0.0;

        foreach ($records as $attendance) {
            switch ($attendance->status) {
                case 'present':
                    $presentDays += 1;
                    break;

                case 'half_day':
                    $presentDays += 0.5;
                    $lopDays += 0.5;
                    break;

                case 'leave':
                    $leaveDays += 1;
                    break;

                case 'absent':
                    $lopDays += 1;
                    break;

                case 'holiday':
                case 'week_off':
                    // Not counted as LOP.
                    break;
            }
        }

        return [
            'working_days' => round((float) $workingDays, 2),
            'present_days' => round($presentDays, 2),
            'leave_days' => round($leaveDays, 2),
            'lop_days' => round($lopDays, 2),
        ];
    }
}

