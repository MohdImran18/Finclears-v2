<?php

namespace App\Models;

use App\Traits\HasUUID;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItrIncome extends BaseModel
{
    protected $table = 'itr_income';

    use HasUUID;

    protected string $uuidColumn = 'uuid';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'income_type_id' => 'integer',
            'amount' => 'decimal:2',
            'tds_amount' => 'decimal:2',
            'tax_paid' => 'decimal:2',
            'is_exempt' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function itrReturn(): BelongsTo
    {
        return $this->belongsTo(ItrReturn::class);
    }

    public function scopeSalary($query)
    {
        return $query->where('income_type_id', 1);
    }

    public function scopeBusiness($query)
    {
        return $query->where('income_type_id', 3);
    }

    public function scopeProfessional($query)
    {
        return $query->where('income_type_id', 3);
    }

    public function scopeCapitalGain($query)
    {
        return $query->where('income_type_id', 4);
    }

    public function isSalary(): bool
    {
        return (int) $this->income_type_id === 1;
    }

    public function isBusiness(): bool
    {
        return (int) $this->income_type_id === 3;
    }

    public function isProfessional(): bool
    {
        return (int) $this->income_type_id === 3;
    }

    public function getNetIncomeAttribute(): float
    {
        return max(
            0,
            (float) $this->amount - (float) $this->tds_amount
        );
    }
}
