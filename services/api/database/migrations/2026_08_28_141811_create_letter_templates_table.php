<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letter_templates', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('code')->unique();

            $table->string('letter_type');

            $table->string('subject')->nullable();

            $table->longText('content');

            $table->string('language')->default('en');

            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);

            $table->unsignedInteger('version')->default(1);

            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['letter_type', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_templates');
    }
};
