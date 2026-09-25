<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letter_template_fields', function (Blueprint $table) {
            $table->id();

            $table->foreignId('letter_template_id')
                ->constrained('letter_templates')
                ->cascadeOnDelete();

            $table->string('field_key');
            $table->string('field_label');

            $table->string('field_type')->default('text');

            $table->string('source')->default('employee');

            $table->text('default_value')->nullable();

            $table->boolean('is_required')->default(false);
            $table->boolean('is_active')->default(true);

            $table->unsignedInteger('display_order')->default(0);

            $table->timestamps();

            $table->unique(
                ['letter_template_id', 'field_key'],
                'letter_template_field_unique'
            );

            $table->index(['letter_template_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_template_fields');
    }
};
