<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('itr_kyc_verifications', function (Blueprint $table) {

            $table->foreignId('itr_return_id')
                ->after('id')
                ->constrained('itr_returns')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->after('itr_return_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('pan', 10)
                ->after('user_id');

            $table->string('name_as_per_pan', 150)
                ->after('pan');

            $table->date('date_of_birth')
                ->after('name_as_per_pan');

            $table->string('verification_status', 30)
                ->default('pending')
                ->after('date_of_birth');

            $table->boolean('name_match')
                ->nullable()
                ->after('verification_status');

            $table->boolean('date_of_birth_match')
                ->nullable()
                ->after('name_match');

            $table->string('aadhaar_seeding_status', 30)
                ->nullable()
                ->after('date_of_birth_match');

            $table->string('transaction_id', 100)
                ->nullable()
                ->after('aadhaar_seeding_status');

            $table->string('provider', 50)
                ->default('sandbox')
                ->after('transaction_id');

            $table->json('provider_response')
                ->nullable()
                ->after('provider');

            $table->timestamp('verified_at')
                ->nullable()
                ->after('provider_response');

            $table->index('pan');
            $table->index('verification_status');
            $table->index('transaction_id');

            $table->unique(
                ['itr_return_id', 'pan'],
                'itr_kyc_return_pan_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('itr_kyc_verifications', function (Blueprint $table) {

            $table->dropUnique('itr_kyc_return_pan_unique');

            $table->dropIndex(['pan']);
            $table->dropIndex(['verification_status']);
            $table->dropIndex(['transaction_id']);

            $table->dropForeign(['itr_return_id']);
            $table->dropForeign(['user_id']);

            $table->dropColumn([
                'itr_return_id',
                'user_id',
                'pan',
                'name_as_per_pan',
                'date_of_birth',
                'verification_status',
                'name_match',
                'date_of_birth_match',
                'aadhaar_seeding_status',
                'transaction_id',
                'provider',
                'provider_response',
                'verified_at',
            ]);
        });
    }
};