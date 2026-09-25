<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'annual_quota',
        'is_paid',
        'requires_approval',
        'is_active',
    ];

    protected $casts = [
        'annual_quota' => 'decimal:2',
        'is_paid' => 'boolean',
        'requires_approval' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function balances(): HasMany
    {
        return $this->hasMany(
            EmployeeLeaveBalance::class,
            'leave_type_id'
        );
    }

    public function applications(): HasMany
    {
        return $this->hasMany(
            LeaveApplication::class,
            'leave_type_id'
        );
    }
}