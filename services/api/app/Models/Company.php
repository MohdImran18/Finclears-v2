<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [

        'uuid',

        'user_id',

        'service_type',

        'company_name',

        'company_type',

        'business_activity',

        'authorized_capital',

        'paid_up_capital',

        'state',

        'city',

        'address',

        'pin_code',

        'status',

        'payment_status',

    ];

    protected $casts = [

        'authorized_capital' => 'decimal:2',

        'paid_up_capital' => 'decimal:2',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function directors()
    {
        return $this->hasMany(
            CompanyDirector::class
        );
    }

    public function shareholders()
    {
        return $this->hasMany(
            CompanyShareholder::class
        );
    }

    public function documents()
    {
        return $this->hasMany(
            CompanyDocument::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    public const STATUS_DRAFT="draft";

    public const STATUS_PENDING="pending";

    public const STATUS_APPROVED="approved";

    public const STATUS_REJECTED="rejected";

}