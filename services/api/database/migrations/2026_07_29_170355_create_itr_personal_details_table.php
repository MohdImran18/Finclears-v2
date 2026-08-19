<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itr_personal_details', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Relationships
            |--------------------------------------------------------------------------
            */

            $table->foreignId('itr_return_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Identity
            |--------------------------------------------------------------------------
            */

            $table->char('pan', 10);

            $table->char('aadhaar', 20)
                ->nullable();

            $table->string('first_name',100);

            $table->string('middle_name',100)
                ->nullable();

            $table->string('last_name',100);

            $table->string('full_name',255);

            /*
            |--------------------------------------------------------------------------
            | Family
            |--------------------------------------------------------------------------
            */

            $table->string('father_name',255);

            $table->string('mother_name',255)
                ->nullable();

            $table->string('spouse_name',255)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Personal Information
            |--------------------------------------------------------------------------
            */

            $table->date('date_of_birth');

            $table->enum('gender',[
                'male',
                'female',
                'other'
            ]);

            $table->enum('marital_status',[
                'single',
                'married',
                'divorced',
                'widowed'
            ])->default('single');

            $table->enum('residential_status',[
                'resident',
                'resident_not_ordinary',
                'non_resident'
            ])->default('resident');

            $table->string('citizenship',100)
                ->default('Indian');

            $table->boolean('is_nri')
                ->default(false);

            /*
            |--------------------------------------------------------------------------
            | Contact
            |--------------------------------------------------------------------------
            */

            $table->string('email',150);

            $table->string('mobile',15);

            $table->string('alternate_mobile',15)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Address
            |--------------------------------------------------------------------------
            */

            $table->text('address_line_1');

            $table->text('address_line_2')
                ->nullable();

            $table->string('landmark',255)
                ->nullable();

            $table->string('city',100);

            $table->string('district',100);

            $table->string('state',100);

            $table->string('country',100)
                ->default('India');

            $table->string('pincode',10);

            /*
            |--------------------------------------------------------------------------
            | Passport
            |--------------------------------------------------------------------------
            */

            $table->string('passport_number',20)
                ->nullable();

            $table->date('passport_expiry')
                ->nullable();
                            /*
            |--------------------------------------------------------------------------
            | Bank Details
            |--------------------------------------------------------------------------
            */

            $table->string('account_holder_name',255)->nullable();

            $table->string('bank_name',255)->nullable();

            $table->string('branch_name',255)->nullable();

            $table->string('account_number',30)->nullable();

            $table->string('ifsc_code',20)->nullable();

            $table->enum('account_type',[
                'saving',
                'current'
            ])->nullable();

            $table->boolean('is_refund_account')
                ->default(true);

            /*
            |--------------------------------------------------------------------------
            | Occupation
            |--------------------------------------------------------------------------
            */

            $table->string('occupation',150)
                ->nullable();

            $table->string('employer_name',255)
                ->nullable();

            $table->string('employer_category',150)
                ->nullable();

            $table->string('business_name',255)
                ->nullable();

            $table->string('business_type',150)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Disability Details
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_disabled')
                ->default(false);

            $table->decimal('disability_percentage',5,2)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Nominee Details
            |--------------------------------------------------------------------------
            */

            $table->boolean('has_nominee')
                ->default(false);

            $table->string('nominee_name',255)
                ->nullable();

            $table->string('nominee_relationship',100)
                ->nullable();

            $table->decimal('nominee_share_percentage',5,2)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */

            $table->timestamps();

            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('itr_return_id');

            $table->index('user_id');

            $table->index('pan');

            $table->index('aadhaar');

            $table->index('email');

            $table->index('mobile');

            $table->index('city');

            $table->index('state');

            $table->index('country');

            $table->index('occupation');

            $table->index('created_at');

            /*
            |--------------------------------------------------------------------------
            | Composite Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'user_id',
                'pan'
            ]);

            $table->index([
                'itr_return_id',
                'user_id'
            ]);

            $table->index([
                'state',
                'city'
            ]);

            /*
            |--------------------------------------------------------------------------
            | Unique Constraints
            |--------------------------------------------------------------------------
            */

            $table->unique('itr_return_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itr_personal_details');
    }
};