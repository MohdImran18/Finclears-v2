<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServicePricing extends Model
{
    use HasFactory;

    protected $table = 'service_pricing';

    protected $fillable = [
        'service_id',
        'plan_name',
        'price',
        'original_price',
        'currency',
        'features',
        'is_popular',
        'is_recommended',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'is_popular' => 'boolean',
        'is_recommended' => 'boolean',
        'status' => 'boolean',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}