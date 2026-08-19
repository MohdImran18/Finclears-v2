<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('return_statuses', function (Blueprint $table) {

            $table->id();

            $table->string('name',100);

            $table->string('code',50)->unique();

            $table->string('color',20)->default('#2563eb');

            $table->unsignedTinyInteger('sequence')->default(1);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index('sequence');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('return_statuses');
    }
};