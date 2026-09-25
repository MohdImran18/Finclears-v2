<?php

namespace App\Http\Controllers;

use App\Models\EmployeeDocument;
use App\Models\EmployeeProfile;
use App\Services\Employee\EmployeeAccessScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class EmployeeDocumentController extends Controller
{
    public function __construct(
        protected EmployeeAccessScope $employeeAccessScope
    ) {
    }

    protected function authorizeEmployee(
        Request $request,
        int $employeeProfileId
    ): EmployeeProfile {
        $employee = EmployeeProfile::find($employeeProfileId);

        if (! $employee) {
            abort(404, "Employee not found.");
        }

        if (! $this->employeeAccessScope->canAccess(
            $request->user(),
            $employee
        )) {
            abort(403, "You are not allowed to access this employee.");
        }

        return $employee;
    }
    /**
     * List documents for an employee.
     */
    public function index(Request $request, int $employeeProfileId): JsonResponse
    {
        $this->authorizeEmployee($request, $employeeProfileId);

        $query = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        );

        if ($request->filled('verification_status')) {
            $query->where(
                'verification_status',
                $request->input('verification_status')
            );
        }

        $documents = $query
            ->with('verifiedBy:id,name,email')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Employee documents retrieved successfully.',
            'data' => $documents,
        ]);
    }

    /**
     * Store a new employee document.
     */
    public function store(
        Request $request,
        int $employeeProfileId
    ): JsonResponse {
        $employee = $this->authorizeEmployee(
            $request,
            $employeeProfileId
        );

        abort_unless(
            $request->user()->hasPermissionTo('documents.create'),
            403,
            'You are not allowed to upload employee documents.'
        );

        if (! $employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found.',
            ], 404);
        }

        $validated = $request->validate([
            'document_type' => [
                'required',
                'string',
                'max:100',
            ],
            'document_name' => [
                'required',
                'string',
                'max:255',
            ],
            'document_number' => [
                'nullable',
                'string',
                'max:150',
            ],
            'file' => [
                'required',
                'file',
                'max:10240',
                'mimes:pdf,jpg,jpeg,png,webp',
            ],
            'issue_date' => [
                'nullable',
                'date',
            ],
            'expiry_date' => [
                'nullable',
                'date',
                'after_or_equal:issue_date',
            ],
            'notes' => [
                'nullable',
                'string',
            ],
        ]);

        $file = $request->file('file');

        $path = $file->store(
            'employee-documents/' . $employeeProfileId,
            'private'
        );

        $document = EmployeeDocument::create([
            'employee_profile_id' => $employeeProfileId,
            'document_type' => $validated['document_type'],
            'document_name' => $validated['document_name'],
            'document_number' => $validated['document_number'] ?? null,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'verification_status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee document uploaded successfully.',
            'data' => $document,
        ], 201);
    }

    /**
     * Show a single employee document.
     */
    public function show(
        Request $request,
        int $employeeProfileId,
        int $id
    ): JsonResponse {
        $this->authorizeEmployee($request, $employeeProfileId);
        $document = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        )
            ->with('verifiedBy:id,name,email')
            ->find($id);

        if (! $document) {
            return response()->json([
                'success' => false,
                'message' => 'Employee document not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee document retrieved successfully.',
            'data' => $document,
        ]);
    }

    /**
     * Update employee document details.
     */
    public function update(
        Request $request,
        int $employeeProfileId,
        int $id
    ): JsonResponse {
        abort_unless(
            $request->user()->hasPermissionTo('documents.edit'),
            403,
            'You are not allowed to update employee documents.'
        );

        $this->authorizeEmployee(
            $request,
            $employeeProfileId
        );

        $document = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        )->find($id);

        if (! $document) {
            return response()->json([
                'success' => false,
                'message' => 'Employee document not found.',
            ], 404);
        }

        $validated = $request->validate([
            'document_type' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],
            'document_name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],
            'document_number' => [
                'nullable',
                'string',
                'max:150',
            ],
            'issue_date' => [
                'nullable',
                'date',
            ],
            'expiry_date' => [
                'nullable',
                'date',
                'after_or_equal:issue_date',
            ],
            'notes' => [
                'nullable',
                'string',
            ],
        ]);

        $document->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee document updated successfully.',
            'data' => $document->fresh(),
        ]);
    }

    /**
     * Replace an employee document file.
     */
    public function replaceFile(
        Request $request,
        int $employeeProfileId,
        int $id
    ): JsonResponse {
        $document = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        )->find($id);

        if (! $document) {
            return response()->json([
                'success' => false,
                'message' => 'Employee document not found.',
            ], 404);
        }

        $request->validate([
            'file' => [
                'required',
                'file',
                'max:10240',
                'mimes:pdf,jpg,jpeg,png,webp',
            ],
        ]);

        $file = $request->file('file');

        if ($document->file_path) {
            Storage::disk('private')->delete($document->file_path);
        }

        $path = $file->store(
            'employee-documents/' . $employeeProfileId,
            'private'
        );

        $document->update([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'verification_status' => 'pending',
            'verified_at' => null,
            'verified_by' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee document file replaced successfully.',
            'data' => $document->fresh(),
        ]);
    }

    /**
     * Verify an employee document.
     */
    public function verify(
        Request $request,
        int $employeeProfileId,
        int $id
    ): JsonResponse {
        abort_unless(
            $request->user()->hasPermissionTo('documents.edit'),
            403,
            'You are not allowed to replace employee document files.'
        );

        $this->authorizeEmployee(
            $request,
            $employeeProfileId
        );

        $document = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        )->find($id);

        if (! $document) {
            return response()->json([
                'success' => false,
                'message' => 'Employee document not found.',
            ], 404);
        }

        $document->update([
            'verification_status' => 'verified',
            'verified_at' => now(),
            'verified_by' => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee document verified successfully.',
            'data' => $document->fresh()->load(
                'verifiedBy:id,name,email'
            ),
        ]);
    }

    /**
     * Reject an employee document.
     */
    public function reject(
        Request $request,
        int $employeeProfileId,
        int $id
    ): JsonResponse {
        abort_unless(
            $request->user()->hasPermissionTo('documents.verify'),
            403,
            'You are not allowed to verify employee documents.'
        );

        $this->authorizeEmployee(
            $request,
            $employeeProfileId
        );

        $document = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        )->find($id);

        if (! $document) {
            return response()->json([
                'success' => false,
                'message' => 'Employee document not found.',
            ], 404);
        }

        $request->validate([
            'notes' => [
                'nullable',
                'string',
            ],
        ]);

        $document->update([
            'verification_status' => 'rejected',
            'verified_at' => null,
            'verified_by' => $request->user()?->id,
            'notes' => $request->input('notes', $document->notes),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee document rejected successfully.',
            'data' => $document->fresh()->load(
                'verifiedBy:id,name,email'
            ),
        ]);
    }

    /**
     * Download an employee document.
     */
    public function download(
        Request $request,
        int $employeeProfileId,
        int $id
    ) {
        $this->authorizeEmployee($request, $employeeProfileId);
        $document = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        )->find($id);

        if (! $document) {
            return response()->json([
                'success' => false,
                'message' => 'Employee document not found.',
            ], 404);
        }

        if (! Storage::disk('private')->exists($document->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Document file not found.',
            ], 404);
        }

        return Storage::disk('private')->download(
            $document->file_path,
            $document->file_name
        );
    }

    /**
     * Delete an employee document.
     */
    public function destroy(
        Request $request,
        int $employeeProfileId,
        int $id
    ): JsonResponse {
        abort_unless(
            $request->user()->hasPermissionTo('documents.delete'),
            403,
            'You are not allowed to delete employee documents.'
        );

        $this->authorizeEmployee(
            $request,
            $employeeProfileId
        );

        $document = EmployeeDocument::where(
            'employee_profile_id',
            $employeeProfileId
        )->find($id);

        if (! $document) {
            return response()->json([
                'success' => false,
                'message' => 'Employee document not found.',
            ], 404);
        }

        if ($document->file_path) {
            Storage::disk('private')->delete($document->file_path);
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee document deleted successfully.',
        ]);
    }
}












