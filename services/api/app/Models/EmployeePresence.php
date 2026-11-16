<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeePresence extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'last_seen_at',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'last_seen_at' => 'datetime',
            'last_activity_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
