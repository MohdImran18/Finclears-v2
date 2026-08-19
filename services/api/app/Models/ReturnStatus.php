<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class ReturnStatus extends BaseModel
{
    protected $table = 'return_statuses';

    protected $fillable = [
        'name',
        'code',
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
            'return_status_id'
        );
    }
}