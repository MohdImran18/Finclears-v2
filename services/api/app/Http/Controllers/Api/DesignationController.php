<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DesignationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Designation::query()
            ->with('department:id,name,code')
            ->orderBy('name');

        if ($request->filled('department_id')) {
            $query->where(
                'department_id',
                $request->integer('department_id')
            );
        }

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

        $designations = $query->get([
            'id',
            'department_id',
            'name',
            'code',
            'description',
            'status',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Designations fetched successfully.',
            'data' => $designations,
        ]);
    }

    public function show(Designation $designation): JsonResponse
    {
        $designation->load('department:id,name,code');

        return response()->json([
            'success' => true,
            'message' => 'Designation fetched successfully.',
            'data' => $designation,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => [
                'required',
                'integer',
                'exists:departments,id',
            ],
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('designations', 'name')
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'department_id',
                                $request->integer('department_id')
                            )
                    ),
            ],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('designations', 'code')
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'department_id',
                                $request->integer('department_id')
                            )
                    ),
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'status' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $designation = Designation::create($validated);

        $designation->load('department:id,name,code');

        return response()->json([
            'success' => true,
            'message' => 'Designation created successfully.',
            'data' => $designation,
        ], 201);
    }

    public function update(
        Request $request,
        Designation $designation
    ): JsonResponse {
        $departmentId = $request->has('department_id')
            ? $request->integer('department_id')
            : $designation->department_id;

        $validated = $request->validate([
            'department_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:departments,id',
            ],
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('designations', 'name')
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'department_id',
                                $departmentId
                            )
                    )
                    ->ignore($designation->id),
            ],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('designations', 'code')
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'department_id',
                                $departmentId
                            )
                    )
                    ->ignore($designation->id),
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'status' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $designation->update($validated);

        $designation->load('department:id,name,code');

        return response()->json([
            'success' => true,
            'message' => 'Designation updated successfully.',
            'data' => $designation->fresh('department:id,name,code'),
        ]);
    }

    public function destroy(Designation $designation): JsonResponse
    {
        $designation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Designation deleted successfully.',
        ]);
    }
}