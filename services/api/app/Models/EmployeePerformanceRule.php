<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeePerformanceRule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_profile_id',
        'name',
        'code',
        'metric_type',
        'period_type',
        'target_value',
        'minimum_target',
        'maximum_target',
        'minimum_achievement_percentage',
        'maximum_achievement_percentage',
        'incentive_type',
        'incentive_value',
        'incentive_slabs',
        'deduction_type',
        'deduction_value',
        'deduction_slabs',
        'loss_deduction_enabled',
        'loss_deduction_type',
        'loss_deduction_value',
        'attendance_deduction_enabled',
        'attendance_deduction_type',
        'attendance_deduction_value',
        'minimum_incentive',
        'maximum_incentive',
        'minimum_deduction',
        'maximum_deduction',
        'effective_from',
        'effective_to',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'target_value' => 'decimal:2',
        'minimum_target' => 'decimal:2',
        'maximum_target' => 'decimal:2',

        'minimum_achievement_percentage' => 'decimal:4',
        'maximum_achievement_percentage' => 'decimal:4',

        'incentive_value' => 'decimal:2',
        'deduction_value' => 'decimal:2',

        'incentive_slabs' => 'array',
        'deduction_slabs' => 'array',

        'loss_deduction_value' => 'decimal:2',
        'attendance_deduction_value' => 'decimal:2',

        'minimum_incentive' => 'decimal:2',
        'maximum_incentive' => 'decimal:2',
        'minimum_deduction' => 'decimal:2',
        'maximum_deduction' => 'decimal:2',

        'effective_from' => 'date',
        'effective_to' => 'date',

        'loss_deduction_enabled' => 'boolean',
        'attendance_deduction_enabled' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function employeeProfile()
    {
        return $this->belongsTo(
            EmployeeProfile::class,
            'employee_profile_id'
        );
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForMetric($query, string $metric)
    {
        return $query->where('metric_type', $metric);
    }

    public function scopeMonthly($query)
    {
        return $query->where('period_type', 'monthly');
    }
}
