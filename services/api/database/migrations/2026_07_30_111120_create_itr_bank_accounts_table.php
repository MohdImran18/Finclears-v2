<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_bank_accounts', function (Blueprint $table) {

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
            | Bank Information
            |--------------------------------------------------------------------------
            */

            $table->string('account_holder_name',255);

            $table->string('bank_name',255);

            $table->string('branch_name',255)
                ->nullable();

            $table->string('account_number',50);

            $table->string('masked_account_number',50)
                ->nullable();

            $table->string('ifsc_code',20);

            $table->string('micr_code',20)
                ->nullable();

            $table->enum('account_type',[
                'saving',
                'current',
                'cash_credit',
                'overdraft',
                'nre',
                'nro'
            ])->default('saving');

            $table->string('bank_code',20)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Refund Settings
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_primary')
                ->default(false);

            $table->boolean('is_refund_account')
                ->default(true);

            $table->boolean('prevalidated')
                ->default(false);

            $table->timestamp('prevalidated_at')
                ->nullable();

            $table->string('prevalidation_reference',100)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Account Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status',[
                'active',
                'inactive',
                'closed',
                'blocked'
            ])->default('active');
                        /*
            |--------------------------------------------------------------------------
            | NPCI / Refund Validation
            |--------------------------------------------------------------------------
            */

            $table->boolean('npci_mapped')
                ->default(false);

            $table->timestamp('npci_mapped_at')
                ->nullable();

            $table->string('npci_reference',100)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | PAN / Aadhaar Linking
            |--------------------------------------------------------------------------
            */

            $table->boolean('pan_linked')
                ->default(false);

            $table->boolean('aadhaar_linked')
                ->default(false);

            $table->timestamp('pan_verified_at')
                ->nullable();

            $table->timestamp('aadhaar_verified_at')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Government Verification
            |--------------------------------------------------------------------------
            */

            $table->boolean('government_verified')
                ->default(false);

            $table->timestamp('government_verified_at')
                ->nullable();

            $table->string('verification_reference',100)
                ->nullable();

            $table->json('government_response')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | AI Validation
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
            | Bank Metadata
            |--------------------------------------------------------------------------
            */

            $table->string('swift_code',20)
                ->nullable();

            $table->string('upi_id',255)
                ->nullable();

            $table->string('bank_city',150)
                ->nullable();

            $table->string('bank_state',150)
                ->nullable();

            $table->string('bank_country',100)
                ->default('India');

            /*
            |--------------------------------------------------------------------------
            | Security
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_active')
                ->default(true);

            $table->boolean('is_default')
                ->default(false);

            $table->boolean('is_verified')
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

            $table->index('status');

            $table->index('account_number');

            $table->index('ifsc_code');

            $table->index('bank_name');

            $table->index('account_type');

            $table->index('is_primary');

            $table->index('is_default');

            $table->index('is_refund_account');

            $table->index('prevalidated');

            $table->index('government_verified');

            $table->index('ai_validated');

            $table->index('npci_mapped');

            $table->index('is_active');

            $table->index('is_verified');

            $table->index('uuid');

            $table->index('created_at');

            /*
            |--------------------------------------------------------------------------
            | Composite Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'user_id',
                'is_primary'
            ]);

            $table->index([
                'user_id',
                'is_default'
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
                'itr_return_id',
                'is_refund_account'
            ]);

            $table->index([
                'account_number',
                'ifsc_code'
            ]);

            $table->index([
                'government_verified',
                'status'
            ]);

            $table->index([
                'prevalidated',
                'status'
            ]);

            $table->index([
                'npci_mapped',
                'status'
            ]);

            $table->index([
                'ai_validated',
                'status'
            ]);
                    });

        /*
        |--------------------------------------------------------------------------
        | Business Rule Constraints
        |--------------------------------------------------------------------------
        */

        DB::statement("
            ALTER TABLE itr_bank_accounts
            ADD CONSTRAINT chk_itr_bank_accounts_status
            CHECK (
                status IN ('active','inactive','closed','blocked')
            )
        ");

        DB::statement("
            ALTER TABLE itr_bank_accounts
            ADD CONSTRAINT chk_itr_bank_accounts_account_type
            CHECK (
                account_type IN (
                    'saving',
                    'current',
                    'cash_credit',
                    'overdraft',
                    'nre',
                    'nro'
                )
            )
        ");

        DB::statement("
            ALTER TABLE itr_bank_accounts
            ADD CONSTRAINT chk_itr_bank_accounts_version
            CHECK (
                version >= 1
            )
        ");

        DB::statement("
            ALTER TABLE itr_bank_accounts
            ADD CONSTRAINT chk_itr_bank_accounts_ai_confidence
            CHECK (
                ai_confidence_score IS NULL
                OR (
                    ai_confidence_score >= 0
                    AND ai_confidence_score <= 100
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('itr_bank_accounts');

        Schema::enableForeignKeyConstraints();
    }
};