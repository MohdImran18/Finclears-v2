<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_documents', function (Blueprint $table) {

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

            $table->foreignId('document_type_id')
                ->constrained()
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Document Information
            |--------------------------------------------------------------------------
            */

            $table->string('document_name',255);

            $table->string('document_number',100)
                ->nullable();

            $table->string('document_category',100)
                ->nullable();

            $table->string('document_reference',150)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | File Information
            |--------------------------------------------------------------------------
            */

            $table->string('original_file_name',255);

            $table->string('stored_file_name',255);

            $table->string('file_path');

            $table->string('disk',50)
                ->default('public');

            $table->string('mime_type',100);

            $table->unsignedBigInteger('file_size');

            $table->string('file_extension',20);

            $table->string('checksum',255)
                ->nullable();

            $table->boolean('is_encrypted')
                ->default(false);

            $table->boolean('is_password_protected')
                ->default(false);
                            /*
            |--------------------------------------------------------------------------
            | OCR & AI Extraction
            |--------------------------------------------------------------------------
            */

            $table->boolean('ocr_completed')
                ->default(false);

            $table->timestamp('ocr_completed_at')
                ->nullable();

            $table->longText('ocr_text')
                ->nullable();

            $table->json('ocr_data')
                ->nullable();

            $table->boolean('ai_processed')
                ->default(false);

            $table->timestamp('ai_processed_at')
                ->nullable();

            $table->decimal('ai_confidence_score',5,2)
                ->nullable();

            $table->json('ai_extracted_data')
                ->nullable();

            $table->json('validation_errors')
                ->nullable();

            $table->json('warnings')
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

            $table->string('verification_reference',150)
                ->nullable();

            $table->json('government_response')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Preview & Metadata
            |--------------------------------------------------------------------------
            */

            $table->string('thumbnail_path')
                ->nullable();

            $table->unsignedSmallInteger('total_pages')
                ->default(1);

            $table->json('metadata')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Security
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_sensitive')
                ->default(true);

            $table->boolean('is_signed')
                ->default(false);

            $table->string('digital_signature')
                ->nullable();

            $table->timestamp('signed_at')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Document Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status',[
                'uploaded',
                'processing',
                'verified',
                'approved',
                'rejected',
                'archived'
            ])->default('uploaded');

            $table->boolean('is_active')
                ->default(true);

            /*
            |--------------------------------------------------------------------------
            | Remarks
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
            | File Versioning
            |--------------------------------------------------------------------------
            */

            $table->unsignedInteger('revision')
                ->default(1);

            $table->foreignId('parent_document_id')
                ->nullable()
                ->constrained('itr_documents')
                ->nullOnDelete();

            $table->boolean('is_latest_version')
                ->default(true);

            /*
            |--------------------------------------------------------------------------
            | Access Control
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_public')
                ->default(false);

            $table->boolean('allow_download')
                ->default(true);

            $table->timestamp('expires_at')
                ->nullable();

            $table->unsignedInteger('download_count')
                ->default(0);

            $table->timestamp('last_downloaded_at')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Audit Trail
            |--------------------------------------------------------------------------
            */

            $table->foreignId('uploaded_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

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

            $table->index('document_type_id');

            $table->index('status');

            $table->index('document_name');

            $table->index('document_number');

            $table->index('document_category');

            $table->index('mime_type');

            $table->index('file_extension');

            $table->index('government_verified');

            $table->index('ocr_completed');

            $table->index('ai_processed');

            $table->index('revision');

            $table->index('is_latest_version');

            $table->index('created_at');

            $table->index('updated_at');

            /*
            |--------------------------------------------------------------------------
            | Composite Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'itr_return_id',
                'document_type_id'
            ]);

            $table->index([
                'itr_return_id',
                'status'
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
                'government_verified',
                'status'
            ]);

            $table->index([
                'ocr_completed',
                'ai_processed'
            ]);

            $table->index([
                'document_type_id',
                'status'
            ]);

            $table->index([
                'parent_document_id',
                'revision'
            ]);

            $table->index([
                'is_latest_version',
                'document_type_id'
            ]);

            $table->index([
                'status',
                'created_at'
            ]);
            
                        /*
            |--------------------------------------------------------------------------
            | Business Rules
            |--------------------------------------------------------------------------
            */

            // NOTE:
            // document_name is a snapshot of the uploaded document.
            // document_type_id is the master reference.

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

        Schema::dropIfExists('itr_documents');

        Schema::enableForeignKeyConstraints();
    }
};