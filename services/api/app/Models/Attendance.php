<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_profile_id',
        'shift_id',
        'attendance_date',
        'check_in_at',
        'check_out_at',
        'working_minutes',
        'late_minutes',
        'early_departure_minutes',
        'overtime_minutes',
        'status',
        'check_in_source',
        'check_out_source',
        'notes',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
        'working_minutes' => 'integer',
        'late_minutes' => 'integer',
        'early_departure_minutes' => 'integer',
        'overtime_minutes' => 'integer',
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