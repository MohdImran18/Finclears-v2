<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class ItrType extends BaseModel
{
    protected $table = 'itr_types';

    protected $fillable = [
        'name',
        'code',
        'description',
        'eligibility',
        'applicable_to',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * ITR Returns
     */
    public function itrReturns(): HasMany
    {
        return $this->hasMany(
            ItrReturn::class,
            'itr_type_id'
        );
    }
}