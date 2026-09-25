<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadRoutingRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'service_id',
        'lead_tag_id',
        'employee_team_id',
        'priority',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function leadTag(): BelongsTo
    {
        return $this->belongsTo(LeadTag::class);
    }

    public function employeeTeam(): BelongsTo
    {
        return $this->belongsTo(EmployeeTeam::class);
    }
}