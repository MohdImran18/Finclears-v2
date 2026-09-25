<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            $table->foreignId('designation_id')
                ->nullable()
                ->constrained('designations')
                ->nullOnDelete();

            $table->string('employee_code', 50)->unique();

            $table->date('date_of_joining')->nullable();

            $table->date('date_of_birth')->nullable();

            $table->string('gender', 30)->nullable();

            $table->string('employment_type', 50)
                ->default('full_time');

            $table->string('work_location', 120)->nullable();

            $table->string('reporting_manager_id')->nullable();

            $table->string('personal_email')->nullable();

            $table->string('personal_phone', 30)->nullable();

            $table->text('address')->nullable();

            $table->string('city', 100)->nullable();

            $table->string('state', 100)->nullable();

            $table->string('pincode', 20)->nullable();

            $table->string('emergency_contact_name')->nullable();

            $table->string('emergency_contact_phone', 30)->nullable();

            $table->string('emergency_contact_relation', 50)->nullable();

            $table->string('pan_number', 20)->nullable();

            $table->string('aadhaar_number', 30)->nullable();

            $table->string('bank_account_number', 50)->nullable();

            $table->string('bank_name', 120)->nullable();

            $table->string('ifsc_code', 20)->nullable();

            $table->string('account_holder_name')->nullable();

            $table->string('status', 30)->default('active');

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['department_id', 'status']);
            $table->index(['designation_id', 'status']);
            $table->index(['employment_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_profiles');
    }
};
