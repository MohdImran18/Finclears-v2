<?php

namespace App\Models;

use App\Enums\TaxRegime;
use App\Traits\HasUUID;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrTaxComputation extends BaseModel
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

            'tax_regime' => TaxRegime::class,

            'gross_total_income' => 'decimal:2',

            'total_deductions' => 'decimal:2',

            'net_taxable_income' => 'decimal:2',

            'basic_tax' => 'decimal:2',

            'rebate_87a' => 'decimal:2',

            'surcharge' => 'decimal:2',

            'health_education_cess' => 'decimal:2',

            'interest_234a' => 'decimal:2',

            'interest_234b' => 'decimal:2',

            'interest_234c' => 'decimal:2',

            'late_fee_234f' => 'decimal:2',

            'total_tax_liability' => 'decimal:2',

            'tax_paid' => 'decimal:2',

            'refund_amount' => 'decimal:2',

            'net_tax_payable' => 'decimal:2',

            'is_final' => 'boolean',

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

    public function scopeFinal($query)
    {
        return $query->where('is_final', true);
    }

    public function scopeDraft($query)
    {
        return $query->where('is_final', false);
    }

    public function scopeOldRegime($query)
    {
        return $query->where(
            'tax_regime',
            TaxRegime::OLD
        );
    }

    public function scopeNewRegime($query)
    {
        return $query->where(
            'tax_regime',
            TaxRegime::NEW
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isFinal(): bool
    {
        return $this->is_final;
    }

    public function isRefundCase(): bool
    {
        return (float) $this->refund_amount > 0;
    }

    public function isTaxPayable(): bool
    {
        return (float) $this->net_tax_payable > 0;
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getTotalInterestAttribute(): float
    {
        return
            (float) $this->interest_234a +
            (float) $this->interest_234b +
            (float) $this->interest_234c;
    }

    public function getTotalTaxWithInterestAttribute(): float
    {
        return
            (float) $this->total_tax_liability +
            (float) $this->total_interest +
            (float) $this->late_fee_234f;
    }
}