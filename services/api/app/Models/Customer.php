<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'alternate_phone',
        'company_name',
        'status',
        'total_value',
        'notes',
    ];

    protected $casts = [
        'total_value' => 'decimal:2',
    ];
}
