<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\EmployeeProfile;
use App\Models\User;
use App\Services\Employee\EmployeeRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function __construct(
        protected EmployeeRoleService $employeeRoleService,
        protected \App\Services\Employee\EmployeeAccessScope $employeeAccessScope
    ) {
    }

    /**
     * Employee list.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->employeeAccessScope
            ->query($request->user())
            ->with([
                'user:id,name,email,phone,role,status',
                'department:id,name,code',
                'designation:id,name,code,department_id',
                'reportingManager:id,name,email',
            ]);

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));

            $query->where(function ($q) use ($search) {
                $q->where('employee_code', 'like', "%{$search}%")
                    ->orWhere('personal_email', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->integer('department_id'));
        }

        if ($request->filled('designation_id')) {
            $query->where('designation_id', $request->integer('designation_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $perPage = min(
            max((int) $request->input('per_page', 20), 1),
            100
        );

        $employees = $query
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Employees fetched successfully.',
            'data' => $employees,
        ]);
    }

    /**
     * Create employee.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $employee = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => User::ROLE_EMPLOYEE,
                'status' => User::STATUS_ACTIVE,
            ]);

            $profileData = collect($validated)
                ->except([
                    'name',
                    'email',
                    'phone',
                    'password',
                    'password_confirmation',
                ])
                ->toArray();

            $profileData['user_id'] = $user->id;
            $profileData['status'] = $profileData['status'] ?? 'active';

            $employee = EmployeeProfile::create($profileData);

            $this->employeeRoleService->sync($employee);

            return $employee;
        });

        $employee->load([
            'user:id,name,email,phone,role,status',
            'department:id,name,code',
            'designation:id,name,code,department_id',
            'reportingManager:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully.',
            'data' => [
                'employee' => $employee,
            ],
        ], 201);
    }

    /**
     * Employee details.
     */
    public function show(
        Request $request,
        EmployeeProfile $employee
    ): JsonResponse {
        abort_unless(
            $this->employeeAccessScope->canAccess(
                $request->user(),
                $employee
            ),
            403,
            'You are not allowed to access this employee.'
        );

        $employee->load([
            'user:id,name,email,phone,role,status',
            'department:id,name,code',
            'designation:id,name,code,department_id',
            'reportingManager:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee fetched successfully.',
            'data' => [
                'employee' => $employee,
            ],
        ]);
    }

    /**
     * Update employee.
     */
    public function update(
        UpdateEmployeeRequest $request,
        EmployeeProfile $employee
    ): JsonResponse {
        abort_unless(
            $request->user()->hasPermissionTo('employees.edit') &&
            $this->employeeAccessScope->canAccess(
                $request->user(),
                $employee
            ),
            403,
            'You are not allowed to update this employee.'
        );

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $employee) {
            $userFields = [];

            foreach ([
                'name',
                'email',
                'phone',
            ] as $field) {
                if (array_key_exists($field, $validated)) {
                    $userFields[$field] = $validated[$field];
                }
            }

            if (
                array_key_exists('password', $validated)
                && !empty($validated['password'])
            ) {
                $userFields['password'] = Hash::make(
                    $validated['password']
                );
            }

            if (!empty($userFields)) {
                $employee->user->update($userFields);
            }

            $profileData = collect($validated)
                ->except([
                    'name',
                    'email',
                    'phone',
                    'password',
                    'password_confirmation',
                ])
                ->toArray();

            if (!empty($profileData)) {
                $employee->update($profileData);
            }

            $employee->refresh();

            $this->employeeRoleService->sync($employee);
        });

        $employee->refresh()->load([
            'user:id,name,email,phone,role,status',
            'department:id,name,code',
            'designation:id,name,code,department_id',
            'reportingManager:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully.',
            'data' => [
                'employee' => $employee,
            ],
        ]);
    }

    /**
     * Deactivate employee.
     */
    public function destroy(
        Request $request,
        EmployeeProfile $employee
    ): JsonResponse {
        abort_unless(
            $request->user()->hasPermissionTo('employees.edit') &&
            $this->employeeAccessScope->canAccess(
                $request->user(),
                $employee
            ),
            403,
            'You are not allowed to deactivate this employee.'
        );

        DB::transaction(function () use ($employee) {
            $employee->update([
                'status' => 'inactive',
            ]);

            $employee->user->update([
                'status' => User::STATUS_INACTIVE,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Employee deactivated successfully.',
        ]);
    }
}
















