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
        'check_in_photo_path',
        'check_in_latitude',
        'check_in_longitude',
        'check_in_accuracy',
        'check_in_ip',
        'check_out_photo_path',
        'check_out_latitude',
        'check_out_longitude',
        'check_out_accuracy',
        'check_out_ip',
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
        'check_in_latitude' => 'decimal:7',
        'check_in_longitude' => 'decimal:7',
        'check_in_accuracy' => 'decimal:2',
        'check_out_latitude' => 'decimal:7',
        'check_out_longitude' => 'decimal:7',
        'check_out_accuracy' => 'decimal:2',
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