<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class TaxRegime extends BaseModel
{
    protected $table = 'tax_regimes';

    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * ITR Returns
     */
    public function itrReturns(): HasMany
    {
        return $this->hasMany(
            ItrReturn::class,
            'tax_regime_id'
        );
    }
}