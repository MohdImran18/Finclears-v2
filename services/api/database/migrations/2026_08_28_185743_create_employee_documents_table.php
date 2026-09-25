<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id')
                ->constrained('employee_profiles')
                ->cascadeOnDelete();

            $table->string('document_type', 100);
            $table->string('document_name', 255);
            $table->string('document_number', 150)->nullable();

            $table->string('file_path', 500);
            $table->string('file_name', 255);
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type', 100)->nullable();

            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();

            $table->enum('verification_status', [
                'pending',
                'verified',
                'rejected',
            ])->default('pending');

            $table->timestamp('verified_at')->nullable();

            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index([
                'employee_profile_id',
                'document_type',
            ]);

            $table->index('verification_status');
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_documents');
    }
};
