<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeSalaryStructureItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_salary_structure_id',
        'salary_component_id',
        'calculation_type',
        'calculation_basis',
        'amount',
        'percentage',
        'formula',
        'rule_config',
        'minimum_amount',
        'maximum_amount',
        'is_variable',
        'is_taxable',
        'is_statutory',
        'is_reimbursement',
        'is_enabled',
        'display_order',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'percentage' => 'decimal:4',
        'minimum_amount' => 'decimal:2',
        'maximum_amount' => 'decimal:2',

        'rule_config' => 'array',

        'is_variable' => 'boolean',
        'is_taxable' => 'boolean',
        'is_statutory' => 'boolean',
        'is_reimbursement' => 'boolean',
        'is_enabled' => 'boolean',

        'display_order' => 'integer',
    ];

    public function salaryStructure()
    {
        return $this->belongsTo(
            EmployeeSalaryStructure::class,
            'employee_salary_structure_id'
        );
    }

    public function salaryComponent()
    {
        return $this->belongsTo(
            SalaryComponent::class,
            'salary_component_id'
        );
    }

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function scopeVariable($query)
    {
        return $query->where('is_variable', true);
    }

    public function scopeFixed($query)
    {
        return $query->where('is_variable', false);
    }
}
