<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use App\Traits\HasUUID;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrVerification extends BaseModel
{
    use HasUUID;

    protected string $uuidColumn = 'uuid';

    protected $guarded = [];

    /*
    |--------------------------------------------------------------------------
    | Attribute Casting
    |--------------------------------------------------------------------------
    */

    protected function casts(): array
    {
        return [

            'verification_status' => VerificationStatus::class,

            'is_everified' => 'boolean',

            'otp_sent_at' => 'datetime',

            'otp_verified_at' => 'datetime',

            'evc_verified_at' => 'datetime',

            'dsc_verified_at' => 'datetime',

            'verified_at' => 'datetime',

            'expires_at' => 'datetime',

            'metadata' => 'array',

            'created_at' => 'datetime',

            'updated_at' => 'datetime',

            'deleted_at' => 'datetime',

        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function itrReturn(): BelongsTo
    {
        return $this->belongsTo(ItrReturn::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Query Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeVerified($query)
    {
        return $query->where(
            'verification_status',
            VerificationStatus::COMPLETED
        );
    }

    public function scopePending($query)
    {
        return $query->whereIn(
            'verification_status',
            [
                VerificationStatus::NOT_VERIFIED,
                VerificationStatus::OTP_SENT,
            ]
        );
    }

    public function scopeFailed($query)
    {
        return $query->where(
            'verification_status',
            VerificationStatus::FAILED
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isVerified(): bool
    {
        return $this->verification_status === VerificationStatus::COMPLETED;
    }

    public function isPending(): bool
    {
        return in_array(
            $this->verification_status,
            [
                VerificationStatus::NOT_VERIFIED,
                VerificationStatus::OTP_SENT,
            ],
            true
        );
    }

    public function isFailed(): bool
    {
        return $this->verification_status === VerificationStatus::FAILED;
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null
            && now()->greaterThan($this->expires_at);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getVerificationMethodAttribute(): ?string
    {
        if ($this->dsc_verified_at) {
            return 'DSC';
        }

        if ($this->evc_verified_at) {
            return 'EVC';
        }

        if ($this->otp_verified_at) {
            return 'AADHAAR_OTP';
        }

        return null;
    }
}