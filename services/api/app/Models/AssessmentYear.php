<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentYear extends BaseModel
{
    protected $table = 'assessment_years';

    protected $fillable = [
        'financial_year_id',
        'name',
        'code',
        'start_date',
        'end_date',
        'is_active',
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Financial Year
     */
    public function financialYear(): BelongsTo
    {
        return $this->belongsTo(
            FinancialYear::class,
            'financial_year_id'
        );
    }

    /**
     * ITR Returns
     */
    public function itrReturns(): HasMany
    {
        return $this->hasMany(
            ItrReturn::class,
            'assessment_year_id'
        );
    }
}