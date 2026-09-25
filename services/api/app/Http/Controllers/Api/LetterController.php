<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StoreEmployeeLetterRequest;
use App\Http\Requests\Payroll\UpdateEmployeeLetterRequest;
use App\Models\EmployeeLetter;
use App\Models\EmployeeLetterVersion;
use App\Models\EmployeeProfile;
use App\Models\LetterTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class LetterController extends Controller
{
    /**
     * List generated employee letters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = EmployeeLetter::query()
            ->with([
                'employeeProfile.user:id,name,email,phone',
                'employeeProfile.department:id,name,code',
                'employeeProfile.designation:id,name,code',
                'template:id,name,code,letter_type,version',
                'generatedBy:id,name,email',
                'approvedBy:id,name,email',
            ])
            ->orderByDesc('letter_date')
            ->orderByDesc('id');

        if ($request->filled('employee_profile_id')) {
            $query->where(
                'employee_profile_id',
                $request->integer('employee_profile_id')
            );
        }

        if ($request->filled('letter_type')) {
            $query->where(
                'letter_type',
                $request->string('letter_type')->toString()
            );
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->string('status')->toString()
            );
        }

        if ($request->filled('search')) {
            $search = trim(
                $request->string('search')->toString()
            );

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('letter_number', 'like', "%{$search}%")
                    ->orWhere('letter_type', 'like', "%{$search}%")
                    ->orWhereHas(
                        'employeeProfile',
                        function ($employeeQuery) use ($search) {
                            $employeeQuery
                                ->where(
                                    'employee_code',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhereHas(
                                    'user',
                                    function ($userQuery) use ($search) {
                                        $userQuery
                                            ->where(
                                                'name',
                                                'like',
                                                "%{$search}%"
                                            )
                                            ->orWhere(
                                                'email',
                                                'like',
                                                "%{$search}%"
                                            );
                                    }
                                );
                        }
                    );
            });
        }

        $letters = $query->paginate(
            min(
                max(
                    $request->integer('per_page', 20),
                    1
                ),
                100
            )
        );

        return response()->json([
            'success' => true,
            'message' => 'Letters fetched successfully.',
            'data' => $letters,
        ]);
    }

    /**
     * Show one generated letter.
     */
    public function show(int $id): JsonResponse
    {
        $letter = EmployeeLetter::with([
            'employeeProfile.user:id,name,email,phone',
            'employeeProfile.department:id,name,code',
            'employeeProfile.designation:id,name,code',
            'template.fields',
            'generatedBy:id,name,email',
            'approvedBy:id,name,email',
            'versions.createdBy:id,name,email',
        ])->find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Letter fetched successfully.',
            'data' => $letter,
        ]);
    }

    /**
     * List active letter templates.
     */
    public function templates(Request $request): JsonResponse
    {
        $query = LetterTemplate::query()
            ->where('is_active', true)
            ->with([
                'fields' => function ($fieldQuery) {
                    $fieldQuery
                        ->where('is_active', true)
                        ->orderBy('display_order');
                },
            ])
            ->orderBy('letter_type')
            ->orderByDesc('is_default')
            ->orderBy('name');

        if ($request->filled('letter_type')) {
            $query->where(
                'letter_type',
                $request->string('letter_type')->toString()
            );
        }

        if ($request->filled('search')) {
            $search = trim(
                $request->string('search')->toString()
            );

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere(
                        'letter_type',
                        'like',
                        "%{$search}%"
                    );
            });
        }

        return response()->json([
            'success' => true,
            'message' => 'Letter templates fetched successfully.',
            'data' => $query->get(),
        ]);
    }

    /**
     * Show one template with fields.
     */
    public function template(int $id): JsonResponse
    {
        $template = LetterTemplate::with([
            'fields' => function ($query) {
                $query
                    ->where('is_active', true)
                    ->orderBy('display_order');
            },
        ])->find($id);

        if (! $template) {
            return response()->json([
                'success' => false,
                'message' => 'Letter template not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Letter template fetched successfully.',
            'data' => $template,
        ]);
    }

    /**
     * Return employee data useful for letter generation.
     */
    public function employeeFields(int $employeeProfileId): JsonResponse
    {
        $employee = EmployeeProfile::with([
            'user:id,name,email,phone',
            'department:id,name,code',
            'designation:id,name,code',
            'reportingManager:id,name,email',
            'salaryStructures' => function ($query) {
                $query
                    ->where('status', 'active')
                    ->where('is_current', true)
                    ->orderByDesc('effective_from')
                    ->limit(1);
            },
        ])->find($employeeProfileId);

        if (! $employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found.',
            ], 404);
        }

        $salaryStructure = $employee->salaryStructures->first();

        $fields = [
            'employee_profile_id' => $employee->id,
            'employee_id' => $employee->id,
            'employee_code' => $employee->employee_code,
            'employee_name' => $employee->user?->name,
            'employee_email' => $employee->user?->email,
            'employee_phone' => $employee->user?->phone,
            'department_name' => $employee->department?->name,
            'department' => $employee->department?->name,
            'department_code' => $employee->department?->code,
            'designation_name' => $employee->designation?->name,
            'designation' => $employee->designation?->name,
            'designation_code' => $employee->designation?->code,
            'date_of_joining' => $employee->date_of_joining?->format('Y-m-d'),
            'date_of_birth' => $employee->date_of_birth?->format('Y-m-d'),
            'employment_type' => $employee->employment_type,
            'work_location' => $employee->work_location,
            'personal_email' => $employee->personal_email,
            'personal_phone' => $employee->personal_phone,
            'city' => $employee->city,
            'state' => $employee->state,
            'pincode' => $employee->pincode,
            'reporting_manager_name' => $employee->reportingManager?->name,
            'reporting_manager_email' => $employee->reportingManager?->email,
            'basic_salary' => $salaryStructure?->basic_salary,
            'gross_salary' => $salaryStructure?->gross_salary,
            'monthly_ctc' => $salaryStructure?->monthly_ctc,
            'annual_ctc' => $salaryStructure?->annual_ctc,
            'currency' => $salaryStructure?->currency,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Employee letter fields fetched successfully.',
            'data' => [
                'employee' => $employee,
                'fields' => $fields,
            ],
        ]);
    }

    /**
     * Create a letter draft.
     */
    public function store(
        StoreEmployeeLetterRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $letter = DB::transaction(function () use ($validated, $request) {
            $letter = EmployeeLetter::create([
                ...$validated,
                'status' => $validated['status'] ?? 'draft',
                'generated_by' => $request->user()?->id,
            ]);

            return $letter;
        });

        $letter->load([
            'employeeProfile.user:id,name,email,phone',
            'employeeProfile.department:id,name,code',
            'employeeProfile.designation:id,name,code',
            'template.fields',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Letter draft created successfully.',
            'data' => [
                'letter' => $letter,
            ],
        ], 201);
    }

    /**
     * Update a letter draft.
     */
    public function update(
        UpdateEmployeeLetterRequest $request,
        int $id
    ): JsonResponse {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (in_array($letter->status, ['approved', 'issued'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Approved or issued letters cannot be edited.',
            ], 422);
        }

        $letter->update($request->validated());

        $letter->refresh()->load([
            'employeeProfile.user:id,name,email,phone',
            'employeeProfile.department:id,name,code',
            'employeeProfile.designation:id,name,code',
            'template.fields',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Letter updated successfully.',
            'data' => [
                'letter' => $letter,
            ],
        ]);
    }

    /**
     * Generate rendered content from a template.
     */
    public function generate(
        Request $request,
        int $id
    ): JsonResponse {
        $letter = EmployeeLetter::with([
            'employeeProfile.user',
            'employeeProfile.department',
            'employeeProfile.designation',
            'employeeProfile.reportingManager',
            'employeeProfile.salaryStructures' => function ($query) {
                $query
                    ->where('status', 'active')
                    ->where('is_current', true)
                    ->orderByDesc('effective_from')
                    ->limit(1);
            },
            'template.fields',
        ])->find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $letter->template) {
            return response()->json([
                'success' => false,
                'message' => 'Letter template is required before generation.',
            ], 422);
        }

        $fieldValues = is_array($letter->field_values)
            ? $letter->field_values
            : [];

        if ($request->has('field_values')) {
            $request->validate([
                'field_values' => ['required', 'array'],
            ]);

            $fieldValues = array_merge(
                $fieldValues,
                $request->input('field_values', [])
            );
        }

        $employee = $letter->employeeProfile;
        $salaryStructure = $employee->salaryStructures->first();

        $automaticFields = [
            'employee_profile_id' => $employee->id,
            'employee_id' => $employee->id,
            'employee_code' => $employee->employee_code,
            'employee_name' => $employee->user?->name,
            'employee_email' => $employee->user?->email,
            'employee_phone' => $employee->user?->phone,
            'department_name' => $employee->department?->name,
            'department' => $employee->department?->name,
            'department_code' => $employee->department?->code,
            'designation_name' => $employee->designation?->name,
            'designation' => $employee->designation?->name,
            'designation_code' => $employee->designation?->code,
            'date_of_joining' => $employee->date_of_joining?->format('d F Y'),
            'date_of_birth' => $employee->date_of_birth?->format('d F Y'),
            'employment_type' => $employee->employment_type,
            'work_location' => $employee->work_location,
            'personal_email' => $employee->personal_email,
            'personal_phone' => $employee->personal_phone,
            'city' => $employee->city,
            'state' => $employee->state,
            'pincode' => $employee->pincode,
            'reporting_manager_name' => $employee->reportingManager?->name,
            'reporting_manager_email' => $employee->reportingManager?->email,
            'basic_salary' => $salaryStructure?->basic_salary,
            'gross_salary' => $salaryStructure?->gross_salary,
            'monthly_ctc' => $salaryStructure?->monthly_ctc,
            'annual_ctc' => $salaryStructure?->annual_ctc,
            'currency' => $salaryStructure?->currency,
            'letter_date' => $letter->letter_date?->format('d F Y'),
            'effective_date' => $letter->effective_date?->format('d F Y'),
            'letter_number' => $letter->letter_number,
            'letter_title' => $letter->title,
        ];

        /*
         * Automatic employee/system fields are authoritative.
         * Custom template fields may be supplied through field_values,
         * but they must not override employee master data.
         */
        $values = array_merge(
            $fieldValues,
            $automaticFields
        );

        foreach ($letter->template->fields as $field) {
            if (
                $field->is_required &&
                ! array_key_exists($field->field_key, $values)
            ) {
                return response()->json([
                    'success' => false,
                    'message' => "Required field [{$field->field_key}] is missing.",
                ], 422);
            }
        }

        $renderedContent = $letter->template->content;

        $renderedContent = preg_replace_callback(
            '/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/',
            function ($matches) use ($values) {
                $key = $matches[1];

                if (! array_key_exists($key, $values)) {
                    return $matches[0];
                }

                $value = $values[$key];

                if ($value === null) {
                    return '';
                }

                return (string) $value;
            },
            $renderedContent
        );

        $nextVersion = (
            (int) $letter->versions()->max('version')
        ) + 1;

        $pdf = Pdf::loadView('pdf.employee-letter', [
            'letter' => $letter,
            'renderedContent' => $renderedContent,
            'companyName' => config('app.name'),
            'companyAddress' => null,
        ]);

        $pdf->setPaper('a4', 'portrait');

        $directory = 'letters/' . $letter->employee_profile_id;

        $filename = sprintf(
            '%s-v%d-%s.pdf',
            Str::slug($letter->letter_type ?: 'letter'),
            $nextVersion,
            now()->format('YmdHis')
        );

        $pdfPath = $directory . '/' . $filename;

        Storage::disk('public')->put(
            $pdfPath,
            $pdf->output()
        );

        DB::transaction(function () use (
            $letter,
            $values,
            $renderedContent,
            $nextVersion,
            $request,
            $pdfPath
        ) {
            $letter->update([
                'rendered_content' => $renderedContent,
                'field_values' => $values,
                'pdf_path' => $pdfPath,
                'status' => 'generated',
                'generated_at' => now(),
                'generated_by' => $request->user()?->id,
            ]);

            EmployeeLetterVersion::create([
                'employee_letter_id' => $letter->id,
                'version' => $nextVersion,
                'rendered_content' => $renderedContent,
                'field_values' => $values,
                'pdf_path' => $pdfPath,
                'created_by' => $request->user()?->id,
                'change_notes' => $nextVersion === 1
                    ? 'Initial letter generation.'
                    : (
                        $request->input('change_notes')
                            ?: 'Letter regenerated.'
                    ),
            ]);
        });

        $letter->refresh()->load([
            'employeeProfile.user:id,name,email,phone',
            'employeeProfile.department:id,name,code',
            'employeeProfile.designation:id,name,code',
            'template.fields',
            'versions.createdBy:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Letter generated successfully.',
            'data' => [
                'letter' => $letter,
                'rendered_content' => $renderedContent,
                'version' => $nextVersion,
                'pdf_path' => $pdfPath,
                'pdf_url' => Storage::disk('public')->url($pdfPath),
            ],
        ]);
    }

    /**
     * Preview a generated letter PDF in the browser.
     */
    public function preview(int $id)
    {
        $letter = EmployeeLetter::with([
            'employeeProfile.user',
            'employeeProfile.department',
            'employeeProfile.designation',
        ])->find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (empty($letter->rendered_content)) {
            return response()->json([
                'success' => false,
                'message' => 'Letter must be generated before preview.',
            ], 422);
        }

        $pdf = Pdf::loadView('pdf.employee-letter', [
            'letter' => $letter,
            'renderedContent' => $letter->rendered_content,
            'companyName' => config('app.name'),
            'companyAddress' => null,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream(
            Str::slug($letter->letter_type ?: 'letter') . '-' . $letter->id . '.pdf'
        );
    }

    /**
     * Download the generated letter PDF.
     */
    public function download(int $id)
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (empty($letter->pdf_path)) {
            return response()->json([
                'success' => false,
                'message' => 'PDF is not available. Generate the letter first.',
            ], 422);
        }

        if (! Storage::disk('public')->exists($letter->pdf_path)) {
            return response()->json([
                'success' => false,
                'message' => 'PDF file not found.',
            ], 404);
        }

        return Storage::disk('public')->download(
            $letter->pdf_path,
            Str::slug($letter->letter_type ?: 'letter') . '-' . $letter->id . '.pdf'
        );
    }

    /**
     * Get one specific letter version.
     */
    public function version(int $id, int $version): JsonResponse
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        $letterVersion = EmployeeLetterVersion::query()
            ->where('employee_letter_id', $id)
            ->where('version', $version)
            ->with('createdBy:id,name,email')
            ->first();

        if (! $letterVersion) {
            return response()->json([
                'success' => false,
                'message' => 'Letter version not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Letter version fetched successfully.',
            'data' => [
                'letter' => $letter,
                'version' => $letterVersion,
                'pdf_url' => $letterVersion->pdf_path
                    ? Storage::disk('public')->url($letterVersion->pdf_path)
                    : null,
            ],
        ]);
    }

    /**
     * Regenerate an existing letter with new field values.
     */
    public function regenerate(
        Request $request,
        int $id
    ): JsonResponse {
        $request->validate([
            'field_values' => ['nullable', 'array'],
            'change_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $letter->template) {
            return response()->json([
                'success' => false,
                'message' => 'Letter template is required.',
            ], 422);
        }

        if (
            $letter->status === 'issued' &&
            ! $request->boolean('force')
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Issued letters cannot be regenerated.',
            ], 422);
        }

        $fieldValues = array_merge(
            is_array($letter->field_values)
                ? $letter->field_values
                : [],
            $request->input('field_values', [])
        );

        $request->merge([
            'field_values' => $fieldValues,
        ]);

        return $this->generate($request, $id);
    }

    /**
     * Letter versions/history.
     */
    public function versions(int $id): JsonResponse
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        $versions = $letter->versions()
            ->with('createdBy:id,name,email')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Letter history fetched successfully.',
            'data' => [
                'letter_id' => $letter->id,
                'versions' => $versions,
            ],
        ]);
    }

    /**
     * List letters belonging to one employee.
     */
    public function employeeLetters(
        int $employeeProfileId
    ): JsonResponse {
        $employee = EmployeeProfile::find($employeeProfileId);

        if (! $employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found.',
            ], 404);
        }

        $letters = EmployeeLetter::query()
            ->where(
                'employee_profile_id',
                $employeeProfileId
            )
            ->with([
                'template:id,name,code,letter_type,version',
                'generatedBy:id,name,email',
                'approvedBy:id,name,email',
            ])
            ->orderByDesc('letter_date')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Employee letters fetched successfully.',
            'data' => [
                'employee' => $employee->load(
                    'user:id,name,email,phone'
                ),
                'letters' => $letters,
            ],
        ]);
    }

    /**
     * Approve a generated letter.
     */
    public function approve(
        Request $request,
        int $id
    ): JsonResponse {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if ($letter->status !== 'generated') {
            return response()->json([
                'success' => false,
                'message' => 'Only generated letters can be approved.',
            ], 422);
        }

        $letter->update([
            'status' => 'approved',
            'approved_by' => $request->user()?->id,
            'approved_at' => now(),
        ]);

        $letter->refresh()->load([
            'employeeProfile.user:id,name,email,phone',
            'employeeProfile.department:id,name,code',
            'employeeProfile.designation:id,name,code',
            'template:id,name,code,letter_type,version',
            'approvedBy:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Letter approved successfully.',
            'data' => [
                'letter' => $letter,
            ],
        ]);
    }

    /**
     * Download generated letter PDF.
     */
    public function downloadPdf(int $id)
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $letter->pdf_path) {
            return response()->json([
                'success' => false,
                'message' => 'PDF has not been generated for this letter.',
            ], 404);
        }

        if (! Storage::disk('public')->exists($letter->pdf_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Letter PDF file not found.',
            ], 404);
        }

        return Storage::disk('public')->download(
            $letter->pdf_path,
            basename($letter->pdf_path),
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }
    /**
     * Download a specific letter version PDF.
     */
    public function downloadVersionPdf(int $id, int $version)
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        $letterVersion = EmployeeLetterVersion::query()
            ->where('employee_letter_id', $id)
            ->where('version', $version)
            ->first();

        if (! $letterVersion) {
            return response()->json([
                'success' => false,
                'message' => 'Letter version not found.',
            ], 404);
        }

        if (empty($letterVersion->pdf_path)) {
            return response()->json([
                'success' => false,
                'message' => 'PDF is not available for this version.',
            ], 422);
        }

        if (! Storage::disk('public')->exists($letterVersion->pdf_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Version PDF file not found.',
            ], 404);
        }

        return Storage::disk('public')->download(
            $letterVersion->pdf_path,
            Str::slug($letter->letter_type ?: 'letter') .
                '-v' . $version .
                '-' . $letter->id .
                '.pdf'
        );
    }}
