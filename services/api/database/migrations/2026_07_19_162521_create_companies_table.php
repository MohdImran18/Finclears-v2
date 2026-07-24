<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {

            $table->id();

            // UUID
            $table->uuid('uuid')->unique();

            // Owner
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Company Details
            |--------------------------------------------------------------------------
            */

            $table->string('service_type',100);
            $table->string('company_name');
            $table->string('company_type',100);

            $table->text('business_activity')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Capital
            |--------------------------------------------------------------------------
            */

            $table->decimal('authorized_capital',15,2)->default(0);

            $table->decimal('paid_up_capital',15,2)->default(0);

            /*
            |--------------------------------------------------------------------------
            | Address
            |--------------------------------------------------------------------------
            */

            $table->string('state',100);

            $table->string('city',100);

            $table->text('address');

            $table->string('pin_code',10);

            /*
            |--------------------------------------------------------------------------
            | Registration Numbers
            |--------------------------------------------------------------------------
            */

            $table->string('cin')->nullable();

            $table->string('llpin')->nullable();

            $table->string('pan_number')->nullable();

            $table->string('tan_number')->nullable();

            $table->string('gst_number')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Contact
            |--------------------------------------------------------------------------
            */

            $table->string('email')->nullable();

            $table->string('phone',20)->nullable();

            $table->string('website')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status',[
                'draft',
                'pending',
                'approved',
                'rejected',
                'completed'
            ])->default('draft');

            $table->enum('payment_status',[
                'pending',
                'paid',
                'failed',
                'refunded'
            ])->default('pending');

            /*
            |--------------------------------------------------------------------------
            | Assignment
            |--------------------------------------------------------------------------
            */

            $table->foreignId('assigned_ca_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Dates
            |--------------------------------------------------------------------------
            */

            $table->date('incorporation_date')->nullable();

            $table->timestamp('submitted_at')->nullable();

            $table->timestamp('approved_at')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Notes
            |--------------------------------------------------------------------------
            */

            $table->longText('remarks')->nullable();

            $table->softDeletes();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('status');
            $table->index('payment_status');
            $table->index('service_type');
            $table->index('company_type');
            $table->index('company_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};