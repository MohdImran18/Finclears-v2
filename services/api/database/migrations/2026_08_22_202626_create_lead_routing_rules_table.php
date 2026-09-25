<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_routing_rules', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);

            $table->foreignId('service_id')
                ->nullable()
                ->constrained('services')
                ->nullOnDelete();

            $table->foreignId('lead_tag_id')
                ->nullable()
                ->constrained('lead_tags')
                ->nullOnDelete();

            $table->foreignId('employee_team_id')
                ->nullable()
                ->constrained('employee_teams')
                ->nullOnDelete();

            $table->string('priority', 30)
                ->default('normal');

            $table->integer('sort_order')
                ->default(0);

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            // Explicit short index name to stay within MySQL limits.
            $table->index(
                [
                    'service_id',
                    'lead_tag_id',
                    'employee_team_id',
                    'status',
                    'sort_order',
                ],
                'lead_route_match_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_routing_rules');
    }
};