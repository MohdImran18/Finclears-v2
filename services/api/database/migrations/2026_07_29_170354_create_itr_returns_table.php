<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_returns', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Relationships
            |--------------------------------------------------------------------------
            */

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('company_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('financial_year_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('assessment_year_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('itr_type_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('tax_regime_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('return_status_id')
                ->constrained()
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Return Information
            |--------------------------------------------------------------------------
            */

            $table->string('return_number',50)->unique();

            

            $table->string('acknowledgement_number',100)->nullable();

            $table->string('receipt_number',100)->nullable();

            $table->enum('filing_type',[
                'original',
                'revised',
                'belated',
                'updated'
            ])->default('original');

            $table->date('filing_date')->nullable();

            $table->date('verification_date')->nullable();

            /*
            |--------------------------------------------------------------------------
            | User Identity
            |--------------------------------------------------------------------------
            */

            $table->char('pan',10);

           $table->char('aadhaar',20)->nullable();

            $table->string('mobile',15)->nullable();

            $table->string('email',150);

            /*
            |--------------------------------------------------------------------------
            | Income Summary
            |--------------------------------------------------------------------------
            */

            $table->decimal('gross_income',15,2)->default(0);

            $table->decimal('total_deductions',15,2)->default(0);

            $table->decimal('taxable_income',15,2)->default(0);

            $table->decimal('tax_liability',15,2)->default(0);

            $table->decimal('interest_amount',15,2)->default(0);

            $table->decimal('late_fee',15,2)->default(0);

            $table->decimal('relief_amount',15,2)->default(0);

            $table->decimal('rebate_amount',15,2)->default(0);

            $table->decimal('tds_amount',15,2)->default(0);

            $table->decimal('tcs_amount',15,2)->default(0);

            $table->decimal('advance_tax',15,2)->default(0);

            $table->decimal('self_assessment_tax',15,2)->default(0);

            $table->decimal('refund_amount',15,2)->default(0);

            $table->decimal('net_payable',15,2)->default(0);
                        /*
            |--------------------------------------------------------------------------
            | Validation & Filing
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_validated')->default(false);

            $table->timestamp('validated_at')->nullable();

            $table->foreignId('validated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->boolean('is_verified')->default(false);

            $table->timestamp('verified_at')->nullable();

            $table->enum('verification_mode', [
                'none',
                'aadhaar_otp',
                'dsc',
                'evc'
            ])->default('none');

            /*
            |--------------------------------------------------------------------------
            | Workflow
            |--------------------------------------------------------------------------
            */

            $table->enum('workflow_stage', [
                'draft',
                'personal_details',
                'income',
                'deductions',
                'documents',
                'tax_calculation',
                'payment',
                'review',
                'filed',
                'completed',
                'cancelled'
            ])->default('draft');

            $table->unsignedTinyInteger('completion_percentage')
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | AI Engine
            |--------------------------------------------------------------------------
            */

            $table->boolean('ai_reviewed')
                ->default(false);

            $table->json('ai_suggestions')
                ->nullable();

            $table->json('validation_errors')
                ->nullable();

            $table->json('warnings')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Income Tax API
            |--------------------------------------------------------------------------
            */

            $table->json('prefill_response')
                ->nullable();

            $table->json('itr_json')
                ->nullable();

            $table->json('api_request')
                ->nullable();

            $table->json('api_response')
                ->nullable();

            $table->string('api_reference')
                ->nullable();

            $table->string('ack_file')
                ->nullable();

            $table->string('json_file')
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
            | Timestamps
            |--------------------------------------------------------------------------
            */

            $table->timestamps();

            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('user_id');

            $table->index('company_id');

            $table->index('financial_year_id');

            $table->index('assessment_year_id');

            $table->index('itr_type_id');

            $table->index('return_status_id');

            $table->index('workflow_stage');

            $table->index('filing_type');

            $table->index('pan');

            $table->index('mobile');

            $table->index('email');

            $table->index('filing_date');

            $table->index('verification_date');

            $table->index('completion_percentage');

            $table->index('created_at');
            /*
            |--------------------------------------------------------------------------
            | Composite Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'user_id',
                'financial_year_id'
            ]);

            $table->index([
                'user_id',
                'assessment_year_id'
            ]);

            $table->index([
                'financial_year_id',
                'itr_type_id'
            ]);

            $table->index([
                'workflow_stage',
                'return_status_id'
            ]);

            $table->unique([
                'pan',
                'assessment_year_id',
                'itr_type_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itr_returns');
    }
};