<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_income', function (Blueprint $table) {

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

            $table->foreignId('income_type_id')
                ->constrained()
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Source Information
            |--------------------------------------------------------------------------
            */

            $table->string('income_source',255);

            $table->date('income_date')->nullable();

            $table->string('reference_number',100)->nullable();

            $table->string('financial_institution',255)->nullable();

            $table->string('employer_name',255)->nullable();

            $table->string('deductor_name',255)->nullable();

            $table->string('tan_number',20)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Tax Amounts
            |--------------------------------------------------------------------------
            */

            $table->decimal('gross_amount',15,2)->default(0);

            $table->decimal('exempt_amount',15,2)->default(0);

            $table->decimal('taxable_amount',15,2)->default(0);

            $table->decimal('tds_amount',15,2)->default(0);

            $table->decimal('tcs_amount',15,2)->default(0);

            $table->decimal('advance_tax',15,2)->default(0);

            $table->decimal('self_assessment_tax',15,2)->default(0);

            /*
            |--------------------------------------------------------------------------
            | Salary
            |--------------------------------------------------------------------------
            */

            $table->decimal('basic_salary',15,2)->nullable();

            $table->decimal('hra',15,2)->nullable();

            $table->decimal('special_allowance',15,2)->nullable();

            $table->decimal('bonus',15,2)->nullable();

            $table->decimal('other_allowance',15,2)->nullable();

            $table->decimal('perquisites',15,2)->nullable();
                        /*
            |--------------------------------------------------------------------------
            | House Property
            |--------------------------------------------------------------------------
            */

            $table->decimal('annual_value',15,2)->nullable();

            $table->decimal('municipal_tax',15,2)->nullable();

            $table->decimal('standard_deduction',15,2)->nullable();

            $table->decimal('interest_on_housing_loan',15,2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Business / Profession
            |--------------------------------------------------------------------------
            */

            $table->decimal('business_turnover',15,2)->nullable();

            $table->decimal('business_profit',15,2)->nullable();

            $table->decimal('presumptive_income',15,2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Capital Gain
            |--------------------------------------------------------------------------
            */

            $table->decimal('short_term_gain',15,2)->nullable();

            $table->decimal('long_term_gain',15,2)->nullable();

            $table->decimal('indexed_cost',15,2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Other Sources
            |--------------------------------------------------------------------------
            */

            $table->decimal('interest_income',15,2)->nullable();

            $table->decimal('dividend_income',15,2)->nullable();

            $table->decimal('rental_income',15,2)->nullable();

            $table->decimal('family_pension',15,2)->nullable();

            $table->decimal('lottery_income',15,2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Foreign Income
            |--------------------------------------------------------------------------
            */

            $table->decimal('foreign_income',15,2)->nullable();

            $table->string('foreign_country',100)->nullable();

            $table->string('country_code',10)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Currency
            |--------------------------------------------------------------------------
            */

            $table->string('currency_code',10)
                ->default('INR');

            $table->decimal('exchange_rate',12,6)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Enterprise Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status',[
                'draft',
                'validated',
                'approved',
                'rejected'
            ])->default('draft');

            $table->boolean('is_manual_entry')
                ->default(true);

            $table->boolean('is_prefill')
                ->default(false);

            $table->boolean('is_active')
                ->default(true);

            $table->decimal('confidence_score',5,2)
                ->nullable();

            $table->timestamp('synced_at')
                ->nullable();
                            /*
            |--------------------------------------------------------------------------
            | AI Engine
            |--------------------------------------------------------------------------
            */

            $table->boolean('ai_validated')
                ->default(false);

            $table->timestamp('ai_validated_at')
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
            | Government / Income Tax API
            |--------------------------------------------------------------------------
            */

            $table->json('prefill_data')
                ->nullable();

            $table->json('api_request')
                ->nullable();

            $table->json('api_response')
                ->nullable();

            $table->json('government_response')
                ->nullable();

            $table->string('api_reference_no',100)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Supporting Documents
            |--------------------------------------------------------------------------
            */

            $table->json('attachments')
                ->nullable();

            $table->string('form16_file')
                ->nullable();

            $table->string('form16a_file')
                ->nullable();

            $table->string('salary_slip_file')
                ->nullable();

            $table->string('bank_statement_file')
                ->nullable();

            $table->string('capital_gain_statement_file')
                ->nullable();

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
            | Audit
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
            | Record Metadata
            |--------------------------------------------------------------------------
            */

            $table->uuid('uuid')
                ->unique();

            $table->unsignedInteger('version')
                ->default(1);

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

            $table->index('income_type_id');

            $table->index('status');

            $table->index('income_source');

            $table->index('income_date');

            $table->index('tan_number');

            $table->index('reference_number');

            $table->index('gross_amount');

            $table->index('taxable_amount');

            $table->index('foreign_country');

            $table->index('currency_code');

            $table->index('created_at');

            $table->index('updated_at');

            /*
            |--------------------------------------------------------------------------
            | Composite Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'itr_return_id',
                'income_type_id'
            ]);

            $table->index([
                'user_id',
                'income_type_id'
            ]);

            $table->index([
                'company_id',
                'income_type_id'
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
                'created_at'
            ]);

            $table->index([
                'currency_code',
                'foreign_country'
            ]);

            $table->index([
                'itr_return_id',
                'income_source'
            ]);

            /*
            |--------------------------------------------------------------------------
            | Business Rules
            |--------------------------------------------------------------------------
            */


        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('itr_income');

        Schema::enableForeignKeyConstraints();
    }
};