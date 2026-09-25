<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'start_time',
        'end_time',
        'break_duration_minutes',
        'grace_period_minutes',
        'minimum_working_hours',
        'overtime_eligible',
        'overtime_after_hours',
        'cross_midnight',
        'is_active',
        'description',
    ];

    protected $casts = [
        'break_duration_minutes' => 'integer',
        'grace_period_minutes' => 'integer',
        'minimum_working_hours' => 'decimal:2',
        'overtime_after_hours' => 'decimal:2',
        'overtime_eligible' => 'boolean',
        'cross_midnight' => 'boolean',
        'is_active' => 'boolean',
    ];
}