<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RbacSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = 'sanctum';

        /*
        |--------------------------------------------------------------------------
        | Permissions
        |--------------------------------------------------------------------------
        */

        $modules = [
            'dashboard',
            'users',
            'roles',
            'leads',
            'customers',
            'orders',
            'payments',
            'services',
            'blogs',
            'employees',
            'departments',
            'designations',
            'attendance',
            'leave',
            'shifts',
            'holidays',
            'documents',
            'letters',
            'payroll',
            'performance',
            'proforma',
            'invoices',
            'receipts',
            'expenses',
            'income',
            'refunds',
            'credit_notes',
            'debit_notes',
            'reconciliation',
            'finance_reports',
            'monitoring',
            'support',
            'reports',
            'settings',
        ];

        $actions = [
            'view',
            'create',
            'edit',
            'delete',
            'manage',
            'approve',
            'reject',
            'assign',
            'reassign',
            'issue',
            'download',
            'export',
            'audit',
            'request',
            'verify',
            'record',
            'convert',
            'cancel',
        ];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                    'guard_name' => $guard,
                ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        $roles = [
            'super-admin',
            'admin',
            'hr-manager',
            'hr-executive',
            'finance-manager',
            'accountant',
            'department-manager',
            'team-lead',
            'it-support',
            'employee',
            'customer',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => $guard,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Super Admin
        |--------------------------------------------------------------------------
        */

        Role::findByName('super-admin', $guard)
            ->syncPermissions(Permission::all());

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        Role::findByName('admin', $guard)->syncPermissions(
            Permission::whereNotIn('name', [
                'roles.delete',
            ])->get()
        );

        /*
        |--------------------------------------------------------------------------
        | HR Manager
        |--------------------------------------------------------------------------
        */

        $hrManager = [
            'employees.view',
            'employees.create',
            'employees.edit',
            'employees.manage',

            'departments.view',
            'departments.create',
            'departments.edit',

            'designations.view',
            'designations.create',
            'designations.edit',

            'attendance.view',
            'attendance.manage',
            'attendance.approve',

            'leave.view',
            'leave.manage',
            'leave.approve',
            'leave.reject',

            'shifts.view',
            'shifts.manage',

            'holidays.view',
            'holidays.manage',

            'documents.view',
            'documents.create',
            'documents.edit',
            'documents.download',

            'letters.view',
            'letters.create',
            'letters.edit',
            'letters.issue',
            'letters.download',

            'payroll.view',
            'payroll.manage',

            'performance.view',
            'performance.manage',

            'reports.view',
            'reports.export',

            'monitoring.view',
            'monitoring.audit',
        ];

        Role::findByName('hr-manager', $guard)
            ->syncPermissions($hrManager);

        /*
        |--------------------------------------------------------------------------
        | HR Executive
        |--------------------------------------------------------------------------
        */

        $hrExecutive = [
            'employees.view',
            'employees.create',
            'employees.edit',

            'departments.view',
            'designations.view',

            'attendance.view',
            'attendance.manage',

            'leave.view',
            'leave.manage',
            'leave.request',

            'shifts.view',
            'holidays.view',

            'documents.view',
            'documents.create',
            'documents.edit',
            'documents.download',

            'letters.view',
            'letters.create',
            'letters.edit',
            'letters.download',

            'performance.view',
            'reports.view',
        ];

        Role::findByName('hr-executive', $guard)
            ->syncPermissions($hrExecutive);

        /*
        |--------------------------------------------------------------------------
        | Finance Manager
        |--------------------------------------------------------------------------
        */

        $financeManager = [
            'customers.view',
            'orders.view',

            'payments.view',
            'payments.verify',
            'payments.record',

            'proforma.view',
            'proforma.create',
            'proforma.edit',
            'proforma.issue',
            'proforma.convert',

            'invoices.view',
            'invoices.create',
            'invoices.edit',
            'invoices.issue',
            'invoices.cancel',

            'receipts.view',
            'receipts.create',

            'expenses.view',
            'expenses.create',
            'expenses.edit',
            'expenses.approve',

            'income.view',
            'income.create',

            'refunds.view',
            'refunds.create',

            'credit_notes.view',
            'credit_notes.create',

            'debit_notes.view',
            'debit_notes.create',

            'reconciliation.view',
            'reconciliation.manage',

            'finance_reports.view',
            'finance_reports.export',

            'reports.view',
            'reports.export',
        ];

        Role::findByName('finance-manager', $guard)
            ->syncPermissions($financeManager);

        /*
        |--------------------------------------------------------------------------
        | Accountant
        |--------------------------------------------------------------------------
        */

        $accountant = [
            'customers.view',
            'orders.view',

            'payments.view',
            'payments.record',

            'proforma.view',
            'proforma.create',
            'proforma.edit',
            'proforma.issue',
            'proforma.convert',

            'invoices.view',
            'invoices.create',
            'invoices.edit',
            'invoices.issue',
            'invoices.cancel',

            'receipts.view',
            'receipts.create',

            'expenses.view',
            'expenses.create',
            'expenses.edit',

            'income.view',
            'income.create',

            'refunds.view',
            'refunds.create',

            'credit_notes.view',
            'credit_notes.create',

            'debit_notes.view',
            'debit_notes.create',

            'reconciliation.view',
            'reconciliation.manage',

            'finance_reports.view',
            'finance_reports.export',
        ];

        Role::findByName('accountant', $guard)
            ->syncPermissions($accountant);

        /*
        |--------------------------------------------------------------------------
        | Department Manager
        |--------------------------------------------------------------------------
        */

        $departmentManager = [
            'dashboard.view',

            'employees.view',

            'attendance.view',
            'attendance.manage',

            'leave.view',
            'leave.approve',
            'leave.reject',

            'documents.view',

            'performance.view',
            'performance.manage',

            'leads.view',
            'leads.create',
            'leads.edit',
            'leads.assign',
            'leads.reassign',

            'customers.view',
            'orders.view',

            'reports.view',
            'reports.export',

            'monitoring.view',
            'monitoring.audit',
        ];

        Role::findByName('department-manager', $guard)
            ->syncPermissions($departmentManager);

        /*
        |--------------------------------------------------------------------------
        | Team Lead
        |--------------------------------------------------------------------------
        */

        $teamLead = [
            'dashboard.view',

            'employees.view',

            'attendance.view',

            'leave.view',
            'leave.request',

            'leads.view',
            'leads.create',
            'leads.edit',
            'leads.assign',

            'customers.view',
            'orders.view',

            'reports.view',

            'monitoring.view',
        ];

        Role::findByName('team-lead', $guard)
            ->syncPermissions($teamLead);

        /*
        |--------------------------------------------------------------------------
        | IT / Support
        |--------------------------------------------------------------------------
        */

        $itSupport = [
            'dashboard.view',

            'users.view',
            'users.edit',

            'support.view',
            'support.create',
            'support.edit',
            'support.manage',

            'reports.view',
        ];

        Role::findByName('it-support', $guard)
            ->syncPermissions($itSupport);

        /*
        |--------------------------------------------------------------------------
        | Employee
        |--------------------------------------------------------------------------
        */

        $employee = [
            'dashboard.view',

            'leads.view',
            'leads.create',
            'leads.edit',

            'customers.view',
            'customers.create',
            'customers.edit',

            'orders.view',
            'payments.view',

            'services.view',
            'blogs.view',

            'employees.view',

            'attendance.view',
            'attendance.request',

            'leave.view',
            'leave.request',

            'documents.view',
            'documents.download',

            'letters.view',
            'letters.download',

            'payroll.view',

            'performance.view',

            'monitoring.view',

            'support.view',
        ];

        Role::findByName('employee', $guard)
            ->syncPermissions($employee);

        /*
        |--------------------------------------------------------------------------
        | Customer
        |--------------------------------------------------------------------------
        */

        $customer = [
            'dashboard.view',

            'customers.view',

            'orders.view',
            'payments.view',

            'documents.view',
            'documents.download',

            'support.view',
            'support.create',
        ];

        Role::findByName('customer', $guard)
            ->syncPermissions($customer);

        /*
        |--------------------------------------------------------------------------
        | Legacy User Role -> Spatie Role
        |--------------------------------------------------------------------------
        */

        $mapping = [
            'admin' => 'admin',
            'employee' => 'employee',
            'client' => 'customer',
        ];

        User::query()
            ->select(['id', 'role'])
            ->get()
            ->each(function (User $user) use ($mapping): void {
                $legacyRole = strtolower((string) $user->role);

                if (isset($mapping[$legacyRole])) {
                    $user->syncRoles([$mapping[$legacyRole]]);
                }
            });

        /*
        |--------------------------------------------------------------------------
        | Clear Permission Cache
        |--------------------------------------------------------------------------
        */

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}