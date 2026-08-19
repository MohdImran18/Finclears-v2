<?php

namespace App\Models;

use App\Enums\DeductionType;
use App\Traits\HasUUID;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrDeduction extends BaseModel
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

            'deduction_type' => DeductionType::class,

            'eligible_amount' => 'decimal:2',

            'claimed_amount' => 'decimal:2',

            'approved_amount' => 'decimal:2',

            'is_verified' => 'boolean',

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
        return $query->where('is_verified', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_verified', false);
    }

    public function scopeSection80C($query)
    {
        return $query->where(
            'deduction_type',
            DeductionType::SECTION_80C
        );
    }

    public function scopeSection80D($query)
    {
        return $query->where(
            'deduction_type',
            DeductionType::SECTION_80D
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isVerified(): bool
    {
        return $this->is_verified;
    }

    public function is80C(): bool
    {
        return $this->deduction_type === DeductionType::SECTION_80C;
    }

    public function is80D(): bool
    {
        return $this->deduction_type === DeductionType::SECTION_80D;
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getRemainingEligibleAmountAttribute(): float
    {
        return max(
            0,
            (float) $this->eligible_amount -
            (float) $this->claimed_amount
        );
    }
}