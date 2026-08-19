<?php

namespace App\Models;

use App\Enums\RefundStatus;
use App\Traits\HasUUID;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrRefund extends BaseModel
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

            'refund_status' => RefundStatus::class,

            'refund_amount' => 'decimal:2',

            'interest_amount' => 'decimal:2',

            'total_refund_amount' => 'decimal:2',

            'processed_at' => 'datetime',

            'credited_at' => 'datetime',

            'created_at' => 'datetime',

            'updated_at' => 'datetime',

            'deleted_at' => 'datetime',

            'metadata' => 'array',

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

    public function scopePending($query)
    {
        return $query->where(
            'refund_status',
            RefundStatus::PENDING
        );
    }

    public function scopeProcessed($query)
    {
        return $query->where(
            'refund_status',
            RefundStatus::UNDER_PROCESS
        );
    }

    public function scopeIssued($query)
    {
        return $query->where(
            'refund_status',
            RefundStatus::ISSUED
        );
    }

    public function scopeFailed($query)
    {
        return $query->where(
            'refund_status',
            RefundStatus::FAILED
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helper Methods
    |--------------------------------------------------------------------------
    */

    public function isPending(): bool
    {
        return $this->refund_status === RefundStatus::PENDING;
    }

    public function isProcessed(): bool
    {
        return $this->refund_status === RefundStatus::UNDER_PROCESS;
    }

    public function isIssued(): bool
    {
        return $this->refund_status === RefundStatus::ISSUED;
    }

    public function isFailed(): bool
    {
        return $this->refund_status === RefundStatus::FAILED;
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getIsCreditedAttribute(): bool
    {
        return !is_null($this->credited_at);
    }

    public function getNetRefundAttribute(): float
    {
        return
            (float) $this->refund_amount +
            (float) $this->interest_amount;
    }
}