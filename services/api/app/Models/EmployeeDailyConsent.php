<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeDailyConsent extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_DECLINED = 'declined';
    public const STATUS_WITHDRAWN = 'withdrawn';

    protected $fillable = [
        'user_id',
        'work_date',
        'policy_version',
        'status',
        'accepted_at',
        'withdrawn_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'work_date' => 'date',
        'accepted_at' => 'datetime',
        'withdrawn_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}