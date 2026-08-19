<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class FinancialYear extends BaseModel
{
    protected $table = 'financial_years';

    protected $fillable = [
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
     * Assessment years linked with this financial year.
     */
    public function assessmentYears(): HasMany
    {
        return $this->hasMany(
            AssessmentYear::class,
            'financial_year_id'
        );
    }
}