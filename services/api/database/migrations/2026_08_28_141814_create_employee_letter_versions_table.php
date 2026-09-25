<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_letter_versions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_letter_id')
                ->constrained('employee_letters')
                ->cascadeOnDelete();

            $table->unsignedInteger('version');

            $table->longText('rendered_content');

            $table->json('field_values')->nullable();

            $table->string('pdf_path')->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('change_notes')->nullable();

            $table->timestamps();

            $table->unique(
                ['employee_letter_id', 'version'],
                'employee_letter_version_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_letter_versions');
    }
};
