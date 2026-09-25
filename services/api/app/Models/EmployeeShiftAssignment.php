<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeShiftAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_profile_id',
        'shift_id',
        'effective_from',
        'effective_to',
        'is_current',
        'notes',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to' => 'date',
        'is_current' => 'boolean',
    ];

    public function employeeProfile(): BelongsTo
    {
        return $this->belongsTo(
            EmployeeProfile::class,
            'employee_profile_id'
        );
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(
            Shift::class,
            'shift_id'
        );
    }
}