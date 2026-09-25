<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeTeam extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'employee_team_user',
            'employee_team_id',
            'user_id'
        )->withPivot('is_primary')
         ->withTimestamps();
    }

    public function routingRules(): HasMany
    {
        return $this->hasMany(LeadRoutingRule::class);
    }
}