<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tableName = 'payroll_run_items';
        $columnName = 'employee_salary_structure_item_id';
        $targetTable = 'employee_salary_structure_items';
        $indexName = 'payroll_run_items_structure_item_idx';

        // Add the column only when it does not already exist.
        if (!Schema::hasColumn($tableName, $columnName)) {
            Schema::table($tableName, function (Blueprint $table) use ($columnName) {
                $table->unsignedBigInteger($columnName)
                    ->nullable()
                    ->after('salary_component_id');
            });
        }

        // Inspect existing foreign keys before creating one.
        $foreignKeys = Schema::getForeignKeys($tableName);

        $existingForeignKey = collect($foreignKeys)->first(
            fn (array $foreignKey) =>
                ($foreignKey['columns'] ?? []) === [$columnName]
        );

        if ($existingForeignKey) {
            $correctForeignKey =
                ($existingForeignKey['foreign_table'] ?? null) === $targetTable
                && ($existingForeignKey['foreign_columns'] ?? []) === ['id'];

            if (!$correctForeignKey) {
                throw new \RuntimeException(
                    'Existing payroll salary structure foreign key points to an unexpected table or column.'
                );
            }
        } else {
            Schema::table($tableName, function (Blueprint $table) use ($columnName, $targetTable) {
                $table->foreign($columnName)
                    ->references('id')
                    ->on($targetTable)
                    ->nullOnDelete();
            });
        }

        // Add the named index only when it is missing.
        $indexes = Schema::getIndexes($tableName);

        $hasIndex = collect($indexes)->contains(
            fn (array $index) => ($index['name'] ?? null) === $indexName
        );

        if (!$hasIndex) {
            Schema::table($tableName, function (Blueprint $table) use ($columnName, $indexName) {
                $table->index($columnName, $indexName);
            });
        }
    }

    public function down(): void
    {
        // Intentionally non-destructive.
        // This migration may reconcile schema that already existed
        // before Laravel recorded this migration. Do not drop payroll
        // columns, indexes, or foreign keys during rollback.
    }
};