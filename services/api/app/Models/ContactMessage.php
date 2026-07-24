<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    /**
     * Mass Assignable
     */
    protected $fillable = [

 'name',

    'email',

    'phone',

    'subject',

    'message',

    'source',

    'ip_address',

    'user_agent',

    'status',

    'replied_at',

    ];

    /**
     * Attribute Casting
     */
    protected $casts = [

        'replied_at' => 'datetime',

        'created_at' => 'datetime',

        'updated_at' => 'datetime',

    ];
}