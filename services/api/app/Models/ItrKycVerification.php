<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrKycVerification extends BaseModel
{
    protected $table = 'itr_kyc_verifications';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'name_match' => 'boolean',
            'date_of_birth_match' => 'boolean',
            'provider_response' => 'array',
            'verified_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function itrReturn(): BelongsTo
    {
        return $this->belongsTo(
            ItrReturn::class,
            'itr_return_id'
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }
}