<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceFaq extends Model
{
    use HasFactory;

    protected $table = 'service_faqs';

    protected $fillable = [
        'service_id',
        'question',
        'answer',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    /**
     * Parent Service
     */
    public function service()
    {
        return $this->belongsTo(
            Service::class
        );
    }
}