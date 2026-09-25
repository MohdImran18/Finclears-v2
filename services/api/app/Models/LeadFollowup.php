<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadFollowup extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'user_id',
        'follow_up_at',
        'type',
        'subject',
        'notes',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'follow_up_at' => 'datetime',
        'completed_at' => 'datetime',
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