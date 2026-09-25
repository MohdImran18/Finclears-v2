<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_tag', function (Blueprint $table) {
            $table->foreignId('lead_id')
                ->constrained('leads')
                ->cascadeOnDelete();

            $table->foreignId('lead_tag_id')
                ->constrained('lead_tags')
                ->cascadeOnDelete();

            $table->foreignId('added_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->primary(['lead_id', 'lead_tag_id']);

            $table->index(['lead_tag_id', 'lead_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_tag');
    }
};