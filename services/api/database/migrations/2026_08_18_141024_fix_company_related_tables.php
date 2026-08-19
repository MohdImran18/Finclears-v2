<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_directors', function (Blueprint $table) {
            $table->foreignId('company_id')
                ->after('id')
                ->constrained('companies')
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('pan', 20)->nullable();
            $table->string('aadhaar', 20)->nullable();
            $table->string('din', 50)->nullable();
            $table->string('designation')->nullable();
        });

        Schema::table('company_shareholders', function (Blueprint $table) {
            $table->foreignId('company_id')
                ->after('id')
                ->constrained('companies')
                ->cascadeOnDelete();

            $table->string('name');
            $table->decimal('shares', 15, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
        });

        Schema::create('company_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            $table->string('document_type');
            $table->string('file_path');
            $table->string('status')->default('pending');
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_documents');

        Schema::table('company_shareholders', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn([
                'company_id',
                'name',
                'shares',
                'percentage',
            ]);
        });

        Schema::table('company_directors', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn([
                'company_id',
                'name',
                'email',
                'phone',
                'pan',
                'aadhaar',
                'din',
                'designation',
            ]);
        });
    }
};
