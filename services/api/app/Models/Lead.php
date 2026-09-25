<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Lead extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'alternate_phone',
        'company_name',
        'service_id',
        'source_id',
        'status',
        'priority',
        'assigned_to',
        'estimated_value',
        'notes',
        'next_follow_up_at',
        'converted_at',
        'lost_reason',
        'deletion_reason',
    ];

    protected $casts = [
        'estimated_value' => 'decimal:2',
        'next_follow_up_at' => 'datetime',
        'converted_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function service(): BelongsTo
{
    return $this->belongsTo(Service::class);
}

public function source(): BelongsTo
{
    return $this->belongsTo(LeadSource::class, 'source_id');
}

public function assignedUser(): BelongsTo
{
    return $this->belongsTo(User::class, 'assigned_to');
}

public function activities(): HasMany
{
    return $this->hasMany(ActivityLog::class)
        ->latest('activity_at');
}

public function assignmentHistory(): HasMany
{
    return $this->hasMany(LeadAssignmentHistory::class)
        ->latest();
}

public function comments(): HasMany
{
    return $this->hasMany(LeadComment::class)
        ->latest();
}

public function calls(): HasMany
{
    return $this->hasMany(LeadCall::class)
        ->latest('started_at');
}

public function followups(): HasMany
{
    return $this->hasMany(LeadFollowup::class)
        ->latest('follow_up_at');
}


public function tags(): BelongsToMany
{
    return $this->belongsToMany(
        LeadTag::class,
        'lead_tag',
        'lead_id',
        'lead_tag_id'
    )->withPivot('added_by')
     ->withTimestamps();
}





}