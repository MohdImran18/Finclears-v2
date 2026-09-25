<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadCall extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'user_id',
        'call_type',
        'started_at',
        'ended_at',
        'duration_seconds',
        'outcome',
        'discussion',
        'next_action',
        'follow_up_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'follow_up_at' => 'datetime',
        'duration_seconds' => 'integer',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}