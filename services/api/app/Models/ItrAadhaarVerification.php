<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrAadhaarVerification extends BaseModel
{
    protected $table = 'itr_aadhaar_verifications';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'aadhaar' => 'encrypted',
            'date_of_birth' => 'date',
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