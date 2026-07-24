<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'service_category_id',
        'title',
        'slug',
        'code',
        'icon',
        'featured_image',
        'banner_image',
        'short_description',
        'description',
        'starting_price',
        'price_label',
        'processing_days',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'is_featured',
        'is_popular',
        'status',
        'sort_order',
        'views',
        'orders',
    ];

    protected $casts = [
        'starting_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'status' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(
            ServiceCategory::class,
            'service_category_id'
        );
    }

    public function benefits()
    {
        return $this->hasMany(ServiceBenefit::class);
    }

    public function processes()
    {
        return $this->hasMany(ServiceProcess::class);
    }

    public function documents()
    {
        return $this->hasMany(ServiceDocument::class);
    }

    public function pricing()
    {
        return $this->hasMany(ServicePricing::class);
    }

    public function faqs()
    {
        return $this->hasMany(ServiceFaq::class);
    }
}