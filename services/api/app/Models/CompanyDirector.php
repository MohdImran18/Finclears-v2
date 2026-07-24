<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyDirector extends Model
{
    protected $fillable=[

        'company_id',

        'name',

        'email',

        'phone',

        'pan',

        'aadhaar',

        'din',

        'designation'

    ];

    public function company()
    {
        return $this->belongsTo(
            Company::class
        );
    }
}