<?php

namespace App\Models;

use App\Traits\HasUUID;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItrReturn extends BaseModel
{
    use HasUUID;

    protected $table = 'itr_returns';

    protected string $uuidColumn = 'uuid';

    protected $guarded = [];

    protected $casts = [

        'gross_income' => 'decimal:2',

        'total_deductions' => 'decimal:2',

        'taxable_income' => 'decimal:2',

        'tax_liability' => 'decimal:2',

        'refund_amount' => 'decimal:2',

        'net_payable' => 'decimal:2',

        'filing_date' => 'date',

        'verification_date' => 'date',

        'is_verified' => 'boolean',

        'is_validated' => 'boolean',

        'ai_reviewed' => 'boolean',

        'created_at' => 'datetime',

        'updated_at' => 'datetime',

        'deleted_at' => 'datetime',

    ];

    /*
    |--------------------------------------------------------------------------
    | Master Relationships
    |--------------------------------------------------------------------------
    */

    public function financialYear(): BelongsTo
    {
        return $this->belongsTo(
            FinancialYear::class,
            'financial_year_id'
        );
    }

    public function assessmentYear(): BelongsTo
    {
        return $this->belongsTo(
            AssessmentYear::class,
            'assessment_year_id'
        );
    }

    public function itrType(): BelongsTo
    {
        return $this->belongsTo(
            ItrType::class,
            'itr_type_id'
        );
    }

    public function taxRegime(): BelongsTo
    {
        return $this->belongsTo(
            TaxRegime::class,
            'tax_regime_id'
        );
    }

    public function returnStatus(): BelongsTo
    {
        return $this->belongsTo(
            ReturnStatus::class,
            'return_status_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Existing Relationships
    |--------------------------------------------------------------------------
    */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function incomes(): HasMany
    {
        return $this->hasMany(ItrIncome::class);
    }

    public function deductions(): HasMany
    {
        return $this->hasMany(ItrDeduction::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(ItrPayment::class);
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(ItrRefund::class);
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(ItrVerification::class);
    }

    public function kycVerifications(): HasMany
    {
        return $this->hasMany(ItrKycVerification::class);
    }

    public function taxComputations(): HasMany
    {
        return $this->hasMany(ItrTaxComputation::class);
    }
}