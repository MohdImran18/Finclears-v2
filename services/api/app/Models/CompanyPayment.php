<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyPayment extends BaseModel
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
            'metadata' => 'array',
            'paid_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(
            Company::class
        );
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(
            Order::class
        );
    }

    public function isPending(): bool
    {
        return $this->payment_status === 'pending';
    }

    public function isSuccessful(): bool
    {
        return $this->payment_status === 'success';
    }

    public function isFailed(): bool
    {
        return $this->payment_status === 'failed';
    }
}
