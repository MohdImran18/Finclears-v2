<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_tax_calculations', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Relationships
            |--------------------------------------------------------------------------
            */

            $table->foreignId('itr_return_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('company_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Financial Information
            |--------------------------------------------------------------------------
            */

            $table->foreignId('financial_year_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('assessment_year_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('tax_regime_id')
                ->constrained()
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Income Summary
            |--------------------------------------------------------------------------
            */

            $table->decimal('gross_total_income',15,2)
                ->default(0);

            $table->decimal('total_exempt_income',15,2)
                ->default(0);

            $table->decimal('net_taxable_income',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Deductions
            |--------------------------------------------------------------------------
            */

            $table->decimal('chapter_via_deduction',15,2)
                ->default(0);

            $table->decimal('other_deductions',15,2)
                ->default(0);

            $table->decimal('total_deductions',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Taxable Income
            |--------------------------------------------------------------------------
            */

            $table->decimal('taxable_income',15,2)
                ->default(0);

            $table->decimal('rounded_taxable_income',15,2)
                ->default(0);
                            /*
            |--------------------------------------------------------------------------
            | Income Tax Calculation
            |--------------------------------------------------------------------------
            */

            $table->decimal('income_tax',15,2)
                ->default(0);

            $table->decimal('special_rate_tax',15,2)
                ->default(0);

            $table->decimal('rebate_87a',15,2)
                ->default(0);

            $table->decimal('tax_after_rebate',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Surcharge & Cess
            |--------------------------------------------------------------------------
            */

            $table->decimal('surcharge',15,2)
                ->default(0);

            $table->decimal('marginal_relief',15,2)
                ->default(0);

            $table->decimal('health_education_cess',15,2)
                ->default(0);

            $table->decimal('tax_before_interest',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Interest u/s 234
            |--------------------------------------------------------------------------
            */

            $table->decimal('interest_234a',15,2)
                ->default(0);

            $table->decimal('interest_234b',15,2)
                ->default(0);

            $table->decimal('interest_234c',15,2)
                ->default(0);

            $table->decimal('total_interest',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Relief
            |--------------------------------------------------------------------------
            */

            $table->decimal('relief_89',15,2)
                ->default(0);

            $table->decimal('relief_90',15,2)
                ->default(0);

            $table->decimal('relief_90a',15,2)
                ->default(0);

            $table->decimal('relief_91',15,2)
                ->default(0);

            $table->decimal('total_relief',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Tax Credits
            |--------------------------------------------------------------------------
            */

            $table->decimal('tds_credit',15,2)
                ->default(0);

            $table->decimal('tcs_credit',15,2)
                ->default(0);

            $table->decimal('advance_tax_paid',15,2)
                ->default(0);

            $table->decimal('self_assessment_tax_paid',15,2)
                ->default(0);

            $table->decimal('foreign_tax_credit',15,2)
                ->default(0);

            $table->decimal('mat_credit',15,2)
                ->default(0);

            $table->decimal('total_tax_credit',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Final Tax Liability
            |--------------------------------------------------------------------------
            */

            $table->decimal('gross_tax_liability',15,2)
                ->default(0);

            $table->decimal('net_tax_liability',15,2)
                ->default(0);

            $table->decimal('refund_amount',15,2)
                ->default(0);

            $table->decimal('tax_payable',15,2)
                ->default(0);
                            /*
            |--------------------------------------------------------------------------
            | Regime Comparison
            |--------------------------------------------------------------------------
            */

            $table->decimal('old_regime_tax',15,2)
                ->default(0);

            $table->decimal('new_regime_tax',15,2)
                ->default(0);

            $table->enum('recommended_regime',[
                'old',
                'new'
            ])->nullable();

            $table->decimal('tax_saving',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | AI Calculation Engine
            |--------------------------------------------------------------------------
            */

            $table->boolean('ai_calculated')
                ->default(false);

            $table->timestamp('ai_calculated_at')
                ->nullable();

            $table->decimal('ai_confidence_score',5,2)
                ->nullable();

            $table->json('ai_suggestions')
                ->nullable();

            $table->json('validation_errors')
                ->nullable();

            $table->json('warnings')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Government Reconciliation
            |--------------------------------------------------------------------------
            */

            $table->boolean('government_verified')
                ->default(false);

            $table->timestamp('government_verified_at')
                ->nullable();

            $table->json('government_response')
                ->nullable();

            $table->json('api_request')
                ->nullable();

            $table->json('api_response')
                ->nullable();

            $table->string('api_reference_no',100)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Calculation Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status',[
                'draft',
                'calculated',
                'verified',
                'approved',
                'filed',
                'revised'
            ])->default('draft');

            $table->boolean('is_final')
                ->default(false);

            /*
            |--------------------------------------------------------------------------
            | Notes
            |--------------------------------------------------------------------------
            */

            $table->text('remarks')
                ->nullable();

            $table->text('internal_notes')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Enterprise Metadata
            |--------------------------------------------------------------------------
            */

            $table->uuid('uuid')
                ->unique();

            $table->unsignedInteger('version')
                ->default(1);

            /*
            |--------------------------------------------------------------------------
            | Audit Trail
            |--------------------------------------------------------------------------
            */

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */

            $table->timestamps();

            $table->softDeletes();
                        /*
            |--------------------------------------------------------------------------
            | Performance Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('itr_return_id');

            $table->index('user_id');

            $table->index('company_id');

            $table->index('financial_year_id');

            $table->index('assessment_year_id');

            $table->index('tax_regime_id');

            $table->index('status');

            $table->index('government_verified');

            $table->index('is_final');

            $table->index('taxable_income');

            $table->index('gross_tax_liability');

            $table->index('net_tax_liability');

            $table->index('refund_amount');

            $table->index('tax_payable');

            $table->index('recommended_regime');

            $table->index('created_at');

            $table->index('updated_at');

            /*
            |--------------------------------------------------------------------------
            | Composite Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'itr_return_id',
                'tax_regime_id'
            ]);

            $table->index([
                'financial_year_id',
                'assessment_year_id'
            ]);

            $table->index([
                'user_id',
                'status'
            ]);

            $table->index([
                'company_id',
                'status'
            ]);

            $table->index([
                'status',
                'government_verified'
            ]);

            $table->index([
                'status',
                'is_final'
            ]);

            $table->index([
                'recommended_regime',
                'status'
            ]);

            $table->index([
                'tax_regime_id',
                'status'
            ]);

            $table->index([
                'refund_amount',
                'status'
            ]);

            $table->index([
                'tax_payable',
                'status'
            ]);

            /*
            |--------------------------------------------------------------------------
            | Business Rules
            |--------------------------------------------------------------------------
            */

        

            /*
            |--------------------------------------------------------------------------
            | End Table
            |--------------------------------------------------------------------------
            */

        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('itr_tax_calculations');

        Schema::enableForeignKeyConstraints();
    }
};