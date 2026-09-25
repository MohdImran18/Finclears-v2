<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_letters', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_profile_id')
                ->constrained('employee_profiles')
                ->cascadeOnDelete();

            $table->foreignId('letter_template_id')
                ->nullable()
                ->constrained('letter_templates')
                ->nullOnDelete();

            $table->string('letter_type');

            $table->string('letter_number')->nullable()->unique();

            $table->string('title');

            $table->date('letter_date');

            $table->date('effective_date')->nullable();

            $table->string('status')->default('draft');

            $table->longText('rendered_content')->nullable();

            $table->json('field_values')->nullable();

            $table->string('pdf_path')->nullable();

            $table->timestamp('generated_at')->nullable();

            $table->foreignId('generated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('approved_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index([
                'employee_profile_id',
                'letter_type',
                'status',
            ]);

            $table->index('letter_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_letters');
    }
};
