<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use App\Traits\HasUUID;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrPayment extends BaseModel
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

            'payment_status' => PaymentStatus::class,

            'amount' => 'decimal:2',

            'tax_amount' => 'decimal:2',

            'interest_amount' => 'decimal:2',

            'penalty_amount' => 'decimal:2',

            'gateway_fee' => 'decimal:2',

            'paid_at' => 'datetime',

            'gateway_response' => 'array',

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

    public function scopeSuccess(Builder $query): Builder
    {
        return $query->where(
            'payment_status',
            PaymentStatus::SUCCESS
        );
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where(
            'payment_status',
            PaymentStatus::PENDING
        );
    }

    public function scopeFailed(Builder $query): Builder
    {
        return $query->where(
            'payment_status',
            PaymentStatus::FAILED
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isSuccess(): bool
    {
        return $this->payment_status === PaymentStatus::SUCCESS;
    }

    public function isPending(): bool
    {
        return $this->payment_status === PaymentStatus::PENDING;
    }

    public function isFailed(): bool
    {
        return $this->payment_status === PaymentStatus::FAILED;
    }

    public function isRefunded(): bool
    {
        return $this->payment_status === PaymentStatus::REFUNDED;
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getTotalAmountAttribute(): float
    {
        return
            (float) ($this->tax_amount ?? 0) +
            (float) ($this->interest_amount ?? 0) +
            (float) ($this->penalty_amount ?? 0) +
            (float) ($this->gateway_fee ?? 0);
    }

    public function getGatewayNameAttribute(): ?string
    {
        return $this->payment_gateway;
    }
}