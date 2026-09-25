<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Departments
        |--------------------------------------------------------------------------
        */

        $businessId = DB::table('departments')
            ->where('code', 'BUSINESS')
            ->value('id');

        if (!$businessId) {
            throw new \RuntimeException('BUSINESS department not found.');
        }

        $accountingId = DB::table('departments')
            ->where('code', 'ACCOUNTING')
            ->value('id');

        if (!$accountingId) {
            throw new \RuntimeException('ACCOUNTING department not found.');
        }

        $hrId = DB::table('departments')
            ->where('code', 'HR')
            ->value('id');

        if (!$hrId) {
            throw new \RuntimeException('HR department not found.');
        }

        $supportId = DB::table('departments')
            ->where('code', 'SUPPORT')
            ->value('id');

        if (!$supportId) {
            $supportId = DB::table('departments')->insertGetId([
                'name' => 'Support',
                'code' => 'SUPPORT',
                'description' => 'Customer and technical support operations.',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Existing Business designations
        |--------------------------------------------------------------------------
        */

        DB::table('designations')
            ->where('id', 8)
            ->where('department_id', $businessId)
            ->update([
                'name' => 'Business Executive',
                'code' => 'BE',
                'description' => 'Business development executive.',
                'status' => true,
                'updated_at' => now(),
            ]);

        DB::table('designations')
            ->where('id', 10)
            ->where('department_id', $businessId)
            ->update([
                'name' => 'Business Manager',
                'code' => 'BM',
                'description' => 'Business team manager.',
                'status' => true,
                'updated_at' => now(),
            ]);

        /*
        |--------------------------------------------------------------------------
        | Remaining Business hierarchy
        |--------------------------------------------------------------------------
        */

        $businessDesignations = [
            ['name' => 'Senior Business Executive', 'code' => 'SBE'],
            ['name' => 'Senior Business Manager', 'code' => 'SBM'],
            ['name' => 'Regional Business Manager', 'code' => 'RBM'],
            ['name' => 'Area Business Manager', 'code' => 'ABM'],
            ['name' => 'Territory Business Manager', 'code' => 'TBM'],
        ];

        foreach ($businessDesignations as $designation) {
            DB::table('designations')->updateOrInsert(
                [
                    'department_id' => $businessId,
                    'code' => $designation['code'],
                ],
                [
                    'name' => $designation['name'],
                    'description' => $designation['name'],
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Support hierarchy
        |--------------------------------------------------------------------------
        */

        $supportDesignations = [
            ['name' => 'Support Executive', 'code' => 'SUE'],
            ['name' => 'Senior Support Executive', 'code' => 'SSUE'],
            ['name' => 'Support Manager', 'code' => 'SUM'],
        ];

        foreach ($supportDesignations as $designation) {
            DB::table('designations')->updateOrInsert(
                [
                    'department_id' => $supportId,
                    'code' => $designation['code'],
                ],
                [
                    'name' => $designation['name'],
                    'description' => $designation['name'],
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | HR hierarchy
        |--------------------------------------------------------------------------
        */

        $hrDesignations = [
            ['name' => 'HR Executive', 'code' => 'HRE'],
            ['name' => 'Senior HR Executive', 'code' => 'SHRE'],
            ['name' => 'HR Manager', 'code' => 'HRM'],
        ];

        foreach ($hrDesignations as $designation) {
            DB::table('designations')->updateOrInsert(
                [
                    'department_id' => $hrId,
                    'code' => $designation['code'],
                ],
                [
                    'name' => $designation['name'],
                    'description' => $designation['name'],
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Accounting hierarchy
        |--------------------------------------------------------------------------
        */

        $accountingDesignations = [
            ['name' => 'Accountant', 'code' => 'ACC'],
            ['name' => 'Senior Accountant', 'code' => 'SACC'],
            ['name' => 'Accounts Manager', 'code' => 'AM'],
        ];

        foreach ($accountingDesignations as $designation) {
            DB::table('designations')->updateOrInsert(
                [
                    'department_id' => $accountingId,
                    'code' => $designation['code'],
                ],
                [
                    'name' => $designation['name'],
                    'description' => $designation['name'],
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | This migration modifies existing organizational data.
        | We intentionally do not automatically restore/delete it.
        |--------------------------------------------------------------------------
        */
    }
};