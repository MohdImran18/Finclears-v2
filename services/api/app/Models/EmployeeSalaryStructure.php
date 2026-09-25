<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeSalaryStructure extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_profile_id',
        'structure_name',
        'salary_type',
        'pay_frequency',
        'currency',
        'effective_from',
        'effective_to',
        'basic_salary',
        'gross_salary',
        'monthly_ctc',
        'annual_ctc',
        'monthly_variable_target',
        'annual_variable_target',
        'status',
        'is_current',
        'notes',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to' => 'date',

        'basic_salary' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'monthly_ctc' => 'decimal:2',
        'annual_ctc' => 'decimal:2',
        'monthly_variable_target' => 'decimal:2',
        'annual_variable_target' => 'decimal:2',

        'is_current' => 'boolean',
    ];

    public function employeeProfile()
    {
        return $this->belongsTo(
            EmployeeProfile::class,
            'employee_profile_id'
        );
    }

    public function items()
    {
        return $this->hasMany(
            EmployeeSalaryStructureItem::class,
            'employee_salary_structure_id'
        )->orderBy('display_order');
    }

    public function enabledItems()
    {
        return $this->hasMany(
            EmployeeSalaryStructureItem::class,
            'employee_salary_structure_id'
        )
        ->where('is_enabled', true)
        ->orderBy('display_order');
    }

    public function variableItems()
    {
        return $this->hasMany(
            EmployeeSalaryStructureItem::class,
            'employee_salary_structure_id'
        )
        ->where('is_variable', true)
        ->where('is_enabled', true)
        ->orderBy('display_order');
    }

    public function fixedItems()
    {
        return $this->hasMany(
            EmployeeSalaryStructureItem::class,
            'employee_salary_structure_id'
        )
        ->where('is_variable', false)
        ->where('is_enabled', true)
        ->orderBy('display_order');
    }

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
}
