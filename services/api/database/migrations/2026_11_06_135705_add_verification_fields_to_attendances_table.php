<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->string('check_in_photo_path')->nullable();
            $table->decimal('check_in_latitude', 10, 7)->nullable();
            $table->decimal('check_in_longitude', 10, 7)->nullable();
            $table->decimal('check_in_accuracy', 10, 2)->nullable();
            $table->string('check_in_ip', 45)->nullable();

            $table->string('check_out_photo_path')->nullable();
            $table->decimal('check_out_latitude', 10, 7)->nullable();
            $table->decimal('check_out_longitude', 10, 7)->nullable();
            $table->decimal('check_out_accuracy', 10, 2)->nullable();
            $table->string('check_out_ip', 45)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn([
                'check_in_photo_path',
                'check_in_latitude',
                'check_in_longitude',
                'check_in_accuracy',
                'check_in_ip',
                'check_out_photo_path',
                'check_out_latitude',
                'check_out_longitude',
                'check_out_accuracy',
                'check_out_ip',
            ]);
        });
    }
};
