<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeadTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function leads(): BelongsToMany
    {
        return $this->belongsToMany(
            Lead::class,
            'lead_tag',
            'lead_tag_id',
            'lead_id'
        )->withPivot('added_by')
         ->withTimestamps();
    }

    public function routingRules(): HasMany
    {
        return $this->hasMany(LeadRoutingRule::class);
    }
}