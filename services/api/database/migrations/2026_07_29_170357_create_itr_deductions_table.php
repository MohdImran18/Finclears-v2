<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_deductions', function (Blueprint $table) {

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

            $table->foreignId('deduction_type_id')
                ->constrained()
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Section Information
            |--------------------------------------------------------------------------
            */

            $table->string('section_code',20);

            $table->string('section_name',255);

            $table->text('description')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Amounts
            |--------------------------------------------------------------------------
            */

            $table->decimal('claimed_amount',15,2)
                ->default(0);

            $table->decimal('eligible_amount',15,2)
                ->default(0);

            $table->decimal('approved_amount',15,2)
                ->default(0);

            $table->decimal('disallowed_amount',15,2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Proof
            |--------------------------------------------------------------------------
            */

            $table->boolean('proof_required')
                ->default(false);

            $table->boolean('proof_submitted')
                ->default(false);

            $table->date('proof_submission_date')
                ->nullable();
                            /*
            |--------------------------------------------------------------------------
            | Verification
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_verified')
                ->default(false);

            $table->timestamp('verified_at')
                ->nullable();

            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

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

            $table->json('validation_errors')
                ->nullable();

            $table->json('warnings')
                ->nullable();

            $table->json('ai_suggestions')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Government API
            |--------------------------------------------------------------------------
            */

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
            | Supporting Documents
            |--------------------------------------------------------------------------
            */

            $table->json('attachments')
                ->nullable();

            $table->string('document_reference')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status',[
                'draft',
                'submitted',
                'verified',
                'approved',
                'rejected'
            ])->default('draft');

            $table->boolean('is_active')
                ->default(true);

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
            | Performance Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('itr_return_id');

            $table->index('user_id');

            $table->index('company_id');

            $table->index('deduction_type_id');

            $table->index('section_code');

            $table->index('status');

            $table->index('claimed_amount');

            $table->index('approved_amount');

            $table->index('proof_required');

            $table->index('proof_submitted');

            $table->index('verified_at');

            $table->index('created_at');

            $table->index('updated_at');

            /*
            |--------------------------------------------------------------------------
            | Composite Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'itr_return_id',
                'deduction_type_id'
            ]);

            $table->index([
                'itr_return_id',
                'section_code'
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
                'proof_submitted',
                'status'
            ]);

            $table->index([
                'verified_by',
                'verified_at'
            ]);

            $table->index([
                'deduction_type_id',
                'status'
            ]);

            $table->index([
                'user_id',
                'created_at'
            ]);
                        /*
            |--------------------------------------------------------------------------
            | Business Rules
            |--------------------------------------------------------------------------
            */

            // Note:
            // Keep section_code + section_name as a historical snapshot.
            // deduction_type_id remains the master reference.

            /*
            |--------------------------------------------------------------------------
            | Check Constraints
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

        Schema::dropIfExists('itr_deductions');

        Schema::enableForeignKeyConstraints();
    }
};