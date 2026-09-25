<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollRunItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'payroll_run_id',
        'salary_component_id',
        'employee_salary_structure_item_id',
        'type',
        'component_name',
        'component_code',
        'calculation_type',
        'calculation_basis',
        'configured_amount',
        'configured_percentage',
        'calculated_amount',
        'target_value',
        'achievement_value',
        'achievement_percentage',
        'working_days',
        'present_days',
        'leave_days',
        'lop_days',
        'calculation_data',
        'is_variable',
        'is_taxable',
        'is_statutory',
        'is_reimbursement',
        'display_order',
        'notes',
    ];

    protected $casts = [
        'configured_amount' => 'decimal:2',
        'configured_percentage' => 'decimal:4',
        'calculated_amount' => 'decimal:2',

        'target_value' => 'decimal:2',
        'achievement_value' => 'decimal:2',
        'achievement_percentage' => 'decimal:4',

        'working_days' => 'decimal:2',
        'present_days' => 'decimal:2',
        'leave_days' => 'decimal:2',
        'lop_days' => 'decimal:2',

        'calculation_data' => 'array',

        'is_variable' => 'boolean',
        'is_taxable' => 'boolean',
        'is_statutory' => 'boolean',
        'is_reimbursement' => 'boolean',

        'display_order' => 'integer',
    ];

    public function payrollRun()
    {
        return $this->belongsTo(
            PayrollRun::class,
            'payroll_run_id'
        );
    }

    public function salaryComponent()
    {
        return $this->belongsTo(
            SalaryComponent::class,
            'salary_component_id'
        );
    }

    public function salaryStructureItem()
    {
        return $this->belongsTo(
            EmployeeSalaryStructureItem::class,
            'employee_salary_structure_item_id'
        );
    }

    public function scopeEarnings($query)
    {
        return $query->where('type', 'earning');
    }

    public function scopeDeductions($query)
    {
        return $query->where('type', 'deduction');
    }

    public function scopeReimbursements($query)
    {
        return $query->where('type', 'reimbursement');
    }
}
