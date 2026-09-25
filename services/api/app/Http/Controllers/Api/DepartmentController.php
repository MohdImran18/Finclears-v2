<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Department::query()
            ->withCount('designations')
            ->orderBy('name');

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->boolean('status'));
        }

        $departments = $query->get([
            'id',
            'name',
            'code',
            'description',
            'status',
            'created_at',
            'updated_at',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Departments fetched successfully.',
            'data' => $departments,
        ]);
    }

    public function show(Department $department): JsonResponse
    {
        $department->loadCount('designations');

        return response()->json([
            'success' => true,
            'message' => 'Department fetched successfully.',
            'data' => $department,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', 'unique:departments,name'],
            'code' => ['required', 'string', 'max:50', 'unique:departments,code'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'boolean'],
        ]);

        $department = Department::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department created successfully.',
            'data' => $department,
        ], 201);
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('departments', 'name')->ignore($department->id),
            ],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('departments', 'code')->ignore($department->id),
            ],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'boolean'],
        ]);

        $department->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department updated successfully.',
            'data' => $department->fresh(),
        ]);
    }

    public function destroy(Department $department): JsonResponse
    {
        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully.',
        ]);
    }
}