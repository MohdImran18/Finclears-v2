<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayrollRun extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_profile_id',
        'employee_salary_structure_id',
        'payroll_year',
        'payroll_month',
        'period_start',
        'period_end',

        'basic_salary',
        'fixed_earnings',
        'variable_earnings',

        'performance_incentive',
        'performance_deduction',

        'reimbursement_amount',
        'pending_payment_amount',
        'other_payment_amount',

        'gross_pay',

        'loss_deduction',
        'attendance_deduction',
        'statutory_deduction',
        'other_deduction',
        'total_deductions',

        'net_payable',

        'working_days',
        'present_days',
        'leave_days',
        'lop_days',

        'target_value',
        'achievement_value',
        'achievement_percentage',

        'status',

        'calculated_at',
        'approved_at',
        'paid_at',
        'approved_by',
        'payment_reference',

        'notes',
    ];

    protected $casts = [
        'payroll_year' => 'integer',
        'payroll_month' => 'integer',

        'period_start' => 'date',
        'period_end' => 'date',

        'basic_salary' => 'decimal:2',
        'fixed_earnings' => 'decimal:2',
        'variable_earnings' => 'decimal:2',

        'performance_incentive' => 'decimal:2',
        'performance_deduction' => 'decimal:2',

        'reimbursement_amount' => 'decimal:2',
        'pending_payment_amount' => 'decimal:2',
        'other_payment_amount' => 'decimal:2',

        'gross_pay' => 'decimal:2',

        'loss_deduction' => 'decimal:2',
        'attendance_deduction' => 'decimal:2',
        'statutory_deduction' => 'decimal:2',
        'other_deduction' => 'decimal:2',
        'total_deductions' => 'decimal:2',

        'net_payable' => 'decimal:2',

        'working_days' => 'decimal:2',
        'present_days' => 'decimal:2',
        'leave_days' => 'decimal:2',
        'lop_days' => 'decimal:2',

        'target_value' => 'decimal:2',
        'achievement_value' => 'decimal:2',
        'achievement_percentage' => 'decimal:4',

        'calculated_at' => 'datetime',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
    ];


    public function items()
    {
        return $this->hasMany(
            PayrollRunItem::class,
            'payroll_run_id'
        )->orderBy('display_order');
    }
    public function employeeProfile()
    {
        return $this->belongsTo(
            EmployeeProfile::class,
            'employee_profile_id'
        );
    }

    public function salaryStructure()
    {
        return $this->belongsTo(
            EmployeeSalaryStructure::class,
            'employee_salary_structure_id'
        );
    }

    public function approver()
    {
        return $this->belongsTo(
            User::class,
            'approved_by'
        );
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeCalculated($query)
    {
        return $query->where('status', 'calculated');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeForPeriod(
        $query,
        int $year,
        int $month
    ) {
        return $query
            ->where('payroll_year', $year)
            ->where('payroll_month', $month);
    }
}
