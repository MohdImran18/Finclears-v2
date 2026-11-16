
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $departments = [
            [
                'name' => 'Business',
                'code' => 'BUSINESS',
                'description' => 'Business development and sales operations.',
            ],
            [
                'name' => 'Accounting',
                'code' => 'ACCOUNTING',
                'description' => 'Accounting and finance operations.',
            ],
            [
                'name' => 'HR',
                'code' => 'HR',
                'description' => 'Human resources and people operations.',
            ],
        ];

        foreach ($departments as $department) {
            $exists = DB::table('departments')
                ->where('code', $department['code'])
                ->exists();

            if (!$exists) {
                DB::table('departments')->insert([
                    ...$department,
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Intentionally retain master records.
        // They may be referenced by employee profiles.
    }
};
