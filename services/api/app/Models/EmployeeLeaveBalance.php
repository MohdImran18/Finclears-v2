<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeLeaveBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_profile_id',
        'leave_type_id',
        'year',
        'opening_balance',
        'allocated',
        'used',
        'pending',
        'adjusted',
    ];

    protected $casts = [
        'year' => 'integer',
        'opening_balance' => 'decimal:2',
        'allocated' => 'decimal:2',
        'used' => 'decimal:2',
        'pending' => 'decimal:2',
        'adjusted' => 'decimal:2',
    ];

    public function employeeProfile(): BelongsTo
    {
        return $this->belongsTo(
            EmployeeProfile::class,
            'employee_profile_id'
        );
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(
            LeaveType::class,
            'leave_type_id'
        );
    }

    public function availableBalance(): float
    {
        return max(
            0,
            (float) $this->opening_balance
            + (float) $this->allocated
            + (float) $this->adjusted
            - (float) $this->used
            - (float) $this->pending
        );
    }
}