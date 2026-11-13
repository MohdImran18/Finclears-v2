<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StoreEmployeeLetterRequest;
use App\Http\Requests\Payroll\UpdateEmployeeLetterRequest;
use App\Models\EmployeeLetter;
use App\Models\EmployeeLetterVersion;
use App\Models\EmployeeProfile;
use App\Models\LetterTemplate;
use App\Models\LetterTemplateField;
use App\Models\User;
use App\Services\Employee\EmployeeAccessScope;
use App\Services\Notifications\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use League\CommonMark\GithubFlavoredMarkdownConverter;

class LetterController extends Controller
{
    public function __construct(
        protected EmployeeAccessScope $employeeAccessScope,
        protected NotificationService $notificationService
    ) {}

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

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $allowedEmployeeIds = $this->employeeAccessScope
            ->query($user)
            ->select('id');

        $query->whereIn('employee_profile_id', $allowedEmployeeIds);


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
    public function show(Request $request, int $id): JsonResponse
    {
        $letter = EmployeeLetter::with([
            'employeeProfile.user:id,name,email,phone',
            'employeeProfile.department:id,name,code',
            'employeeProfile.designation:id,name,code',
            'template.fields',
            'generatedBy:id,name,email',
            'approvedBy:id,name,email',
            'hrApprovedBy:id,name,email',
            'hrRejectedBy:id,name,email',
            'adminApprovedBy:id,name,email',
            'adminRejectedBy:id,name,email',
            'versions.createdBy:id,name,email',
        ])->find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (
            ! $letter->employeeProfile ||
            ! $this->employeeAccessScope->canAccess(
                $request->user(),
                $letter->employeeProfile
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
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
     * Check whether the current user can manage letter templates.
     */
    private function canManageTemplates(?User $user): bool
    {
        return $user !== null && (
            $user->isAdmin()
            || $user->hasRole('super-admin')
            || $user->hasRole('hr-manager')
        );
    }

    /**
     * Create a letter template with its dynamic fields.
     */
    public function storeTemplate(Request $request): JsonResponse
    {
        if (! $this->canManageTemplates($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to create letter templates.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255', 'unique:letter_templates,code'],
            'letter_type' => ['required', 'string', 'max:100'],
            'subject' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'language' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
            'is_default' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
            'fields' => ['sometimes', 'array'],
            'fields.*.field_key' => ['required', 'string', 'max:255', 'distinct'],
            'fields.*.field_label' => ['required', 'string', 'max:255'],
            'fields.*.field_type' => ['required', 'in:text,textarea,date,number'],
            'fields.*.source' => ['required', 'in:employee,system,company,manual'],
            'fields.*.default_value' => ['nullable', 'string'],
            'fields.*.is_required' => ['sometimes', 'boolean'],
            'fields.*.is_active' => ['sometimes', 'boolean'],
            'fields.*.display_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $template = DB::transaction(function () use ($validated) {
            $fields = $validated['fields'] ?? [];
            unset($validated['fields']);

            $template = LetterTemplate::create(array_merge(
                $validated,
                [
                    'language' => $validated['language'] ?? 'en',
                    'is_active' => $validated['is_active'] ?? true,
                    'is_default' => $validated['is_default'] ?? false,
                    'version' => 1,
                ]
            ));

            foreach ($fields as $index => $field) {
                $template->fields()->create(array_merge(
                    $field,
                    [
                        'is_required' => $field['is_required'] ?? false,
                        'is_active' => $field['is_active'] ?? true,
                        'display_order' => $field['display_order'] ?? $index,
                    ]
                ));
            }

            return $template->load('fields');
        });

        return response()->json([
            'success' => true,
            'message' => 'Letter template created successfully.',
            'data' => $template,
        ], 201);
    }

    /**
     * Update a template without deleting its historical fields.
     */
    public function updateTemplate(Request $request, int $id): JsonResponse
    {
        if (! $this->canManageTemplates($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to update letter templates.',
            ], 403);
        }

        $template = LetterTemplate::find($id);

        if (! $template) {
            return response()->json([
                'success' => false,
                'message' => 'Letter template not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'code' => ['sometimes', 'required', 'string', 'max:255', 'unique:letter_templates,code,' . $id],
            'letter_type' => ['sometimes', 'required', 'string', 'max:100'],
            'subject' => ['nullable', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
            'language' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
            'is_default' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
            'fields' => ['sometimes', 'array'],
            'fields.*.field_key' => ['required', 'string', 'max:255', 'distinct'],
            'fields.*.field_label' => ['required', 'string', 'max:255'],
            'fields.*.field_type' => ['required', 'in:text,textarea,date,number'],
            'fields.*.source' => ['required', 'in:employee,system,company,manual'],
            'fields.*.default_value' => ['nullable', 'string'],
            'fields.*.is_required' => ['sometimes', 'boolean'],
            'fields.*.is_active' => ['sometimes', 'boolean'],
            'fields.*.display_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $hasFields = array_key_exists('fields', $validated);

        $updated = DB::transaction(function () use ($template, $validated, $hasFields) {
            if (array_key_exists('fields', $validated)) {
                $fields = $validated['fields'];
                unset($validated['fields']);

                // Preserve existing field records; deactivate omitted fields.
                $template->fields()->update(['is_active' => false]);

                foreach ($fields as $index => $field) {
                    $template->fields()->updateOrCreate(
                        ['field_key' => $field['field_key']],
                        array_merge(
                            $field,
                            [
                                'is_required' => $field['is_required'] ?? false,
                                'is_active' => $field['is_active'] ?? true,
                                'display_order' => $field['display_order'] ?? $index,
                            ]
                        )
                    );
                }
            }

            if (! empty($validated)) {
                $template->fill($validated);
                $template->version = ((int) $template->version) + 1;
                $template->save();
            } elseif ($hasFields) {
                $template->version = ((int) $template->version) + 1;
                $template->save();
            }

            return $template->fresh()->load('fields');
        });

        return response()->json([
            'success' => true,
            'message' => 'Letter template updated successfully.',
            'data' => $updated,
        ]);
    }

    /**
     * Return employee data useful for letter generation.
     */
    public function employeeFields(Request $request, int $employeeProfileId): JsonResponse
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

        if (! $this->employeeAccessScope->canAccess(
            $request->user(),
            $employee
        )) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee.',
            ], 403);
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

        $employee = EmployeeProfile::find($validated['employee_profile_id'] ?? 0);

        if (
            ! $employee ||
            ! $this->employeeAccessScope->canAccess($request->user(), $employee)
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to create a letter for this employee.',
            ], 403);
        }

        $letter = DB::transaction(function () use ($validated, $request) {
            unset($validated['status']);

            $letter = EmployeeLetter::create([
                ...$validated,
                'status' => 'draft',
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

        if (
            ! $letter->employeeProfile ||
            ! $this->employeeAccessScope->canAccess(
                $request->user(),
                $letter->employeeProfile
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
        }

        $validated = $request->validated();

        if (isset($validated['employee_profile_id'])) {
            $targetEmployee = EmployeeProfile::find($validated['employee_profile_id']);

            if (
                ! $targetEmployee ||
                ! $this->employeeAccessScope->canAccess($request->user(), $targetEmployee)
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not allowed to assign this letter to the selected employee.',
                ], 403);
            }
        }

        if ($letter->status !== 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Only draft letters can be edited.',
            ], 422);
        }

        unset($validated['status']);

        $letter->update($validated);

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

        if (
            ! $letter->employeeProfile ||
            ! $this->employeeAccessScope->canAccess(
                $request->user(),
                $letter->employeeProfile
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to generate this employee letter.',
            ], 403);
        }

        if (! in_array($letter->status, ['draft', 'generated'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Only draft or generated letters can be generated or regenerated.',
            ], 422);
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

        $markdownConverter = new GithubFlavoredMarkdownConverter();
        $renderedContent = $markdownConverter
            ->convert($renderedContent)
            ->getContent();

        $nextVersion = (
            (int) $letter->versions()->max('version')
        ) + 1;

        $pdf = Pdf::loadView('pdf.employee-letter', [
            'letter' => $letter,
            'renderedContent' => $renderedContent,
            'companyName' => 'Finvera Technology Private Limited',
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
    public function preview(Request $request, int $id)
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

        if (! $this->canDownloadLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
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
            'companyName' => 'Finvera Technology Private Limited',
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
    public function download(Request $request, int $id)
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canDownloadLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
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
    public function version(Request $request, int $id, int $version): JsonResponse
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canAccessLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
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

        if (
            ! $letter->employeeProfile ||
            ! $this->employeeAccessScope->canAccess(
                $request->user(),
                $letter->employeeProfile
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
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
    public function versions(Request $request, int $id): JsonResponse
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canAccessLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
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
        Request $request,
        int $employeeProfileId
    ): JsonResponse {
        $employee = EmployeeProfile::find($employeeProfileId);

        if (! $employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found.',
            ], 404);
        }

        if (! $this->employeeAccessScope->canAccess(
            $request->user(),
            $employee
        )) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee.',
            ], 403);
        }

        $lettersQuery = EmployeeLetter::query()
            ->where(
                'employee_profile_id',
                $employeeProfileId
            );


        $letters = $lettersQuery
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
     * Submit a generated letter for HR Manager approval.
     */
    public function submitForHrApproval(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (
            ! $user ||
            ! (
                $user->hasRole('employee') ||
                $user->hasRole('hr-executive') ||
                $user->hasRole('hr-manager') ||
                $user->isAdmin() ||
                $user->hasRole('super-admin')
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to submit employee letters.',
            ], 403);
        }

        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (
            ! $letter->employeeProfile ||
            ! $this->employeeAccessScope->canAccess($user, $letter->employeeProfile)
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to submit this employee letter.',
            ], 403);
        }

        if ($letter->status !== 'generated') {
            return response()->json([
                'success' => false,
                'message' => 'Only generated letters can be submitted for Admin approval.',
            ], 422);
        }

        if (empty($letter->rendered_content) || empty($letter->pdf_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Generate the letter PDF before submitting it for Admin approval.',
            ], 422);
        }

        $letter->update([
            'status' => 'pending_admin_approval',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Letter submitted directly for Admin approval.',
            'data' => [
                'letter' => $letter->fresh(),
            ],
        ]);
    }

    /**
     * HR Manager approves a letter and forwards it to Admin.
     */
    public function hrApprove(Request $request, int $id): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'HR approval stage has been disabled. Letters go directly to Admin or Super Admin.',
        ], 410);
    }

    /**
     * HR Manager rejects a letter at the HR approval stage.
     */
    public function hrReject(Request $request, int $id): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'HR rejection stage has been disabled. Only Admin or Super Admin can reject letters.',
        ], 410);
    }

    /**
     * Admin gives final approval and releases the letter to the employee.
     */
    public function adminApprove(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (! $user || ! ($user->isAdmin() || $user->hasRole('super-admin'))) {
            return response()->json([
                'success' => false,
                'message' => 'Only Admin or Super Admin can give final approval.',
            ], 403);
        }

        $validated = $request->validate([
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canAccessLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to approve this employee letter.',
            ], 403);
        }

        if (! in_array($letter->status, ['pending_admin_approval', 'pending_hr_approval'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Only letters pending approval can be issued.',
            ], 422);
        }

        $approvedAt = now();

        $letter->update([
            'status' => 'issued',
            'admin_approved_by' => $user->id,
            'admin_approved_at' => $approvedAt,
            'admin_approval_remarks' => $validated['remarks'] ?? null,
            'approved_by' => $user->id,
            'approved_at' => $approvedAt,
        ]);

        $letter->refresh()->load([
            'employeeProfile.user:id,name,email,phone',
            'template:id,name,code,letter_type,version',
            'hrApprovedBy:id,name,email',
            'adminApprovedBy:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Final approval completed. Letter has been issued to the employee.',
            'data' => ['letter' => $letter],
        ]);
    }

    /**
     * Admin rejects a letter at the final approval stage.
     */
    public function adminReject(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (! $user || ! ($user->isAdmin() || $user->hasRole('super-admin'))) {
            return response()->json([
                'success' => false,
                'message' => 'Only Admin or Super Admin can reject at the final stage.',
            ], 403);
        }

        $validated = $request->validate([
            'remarks' => ['required', 'string', 'max:2000'],
        ]);

        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canAccessLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to reject this employee letter.',
            ], 403);
        }

        if (! in_array($letter->status, ['pending_admin_approval', 'pending_hr_approval'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Only letters pending approval can be rejected.',
            ], 422);
        }

        $letter->update([
            'status' => 'rejected',
            'admin_rejected_by' => $user->id,
            'admin_rejected_at' => now(),
            'admin_rejection_remarks' => $validated['remarks'],
        ]);

        $letter->refresh()->load([
            'hrApprovedBy:id,name,email',
            'adminRejectedBy:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Letter rejected at Admin approval stage.',
            'data' => ['letter' => $letter],
        ]);
    }

    /**
     * Legacy single-stage approval is permanently disabled.
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Legacy approval endpoint is disabled. Use Admin or Super Admin approval.',
        ], 410);
    }

    /**
     * Download generated letter PDF.
     */
    public function downloadPdf(Request $request, int $id)
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canDownloadLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to download this employee letter.',
            ], 403);
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
    public function downloadVersionPdf(Request $request, int $id, int $version)
    {
        $letter = EmployeeLetter::find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canDownloadLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to download this employee letter.',
            ], 403);
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
    }

    /**
     * PDF preview, printing and downloads are allowed only after final issuance.
     */
    private function canDownloadLetter(
        Request $request,
        EmployeeLetter $letter
    ): bool {
        return $letter->status === 'issued'
            && $this->canAccessLetter($request, $letter);
    }

    /**
     * Check letter access and keep employee access limited to issued letters.
     */
    /**
     * Email a final Admin-approved letter to its employee.
     */
    public function sendLetter(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $isAllowedSender = $user->isAdmin()
            || $user->hasAnyRole([
                'super-admin',
                'hr-manager',
                'hr-executive',
            ]);

        if (! $isAllowedSender) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to send employee letters.',
            ], 403);
        }

        $letter = EmployeeLetter::with('employeeProfile.user')->find($id);

        if (! $letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found.',
            ], 404);
        }

        if (! $this->canAccessLetter($request, $letter)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this employee letter.',
            ], 403);
        }

        if (
            $letter->status !== 'issued'
            || ! $letter->admin_approved_by
            || ! $letter->admin_approved_at
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Final Admin approval is required before sending.',
            ], 422);
        }

        $employee = $letter->employeeProfile?->user;

        if (! $employee || ! filter_var($employee->email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'success' => false,
                'message' => 'Employee email address is missing or invalid.',
            ], 422);
        }

        if (
            empty($letter->pdf_path)
            || ! Storage::disk('public')->exists($letter->pdf_path)
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Approved letter PDF is unavailable.',
            ], 404);
        }

        $pdfPath = Storage::disk('public')->path($letter->pdf_path);

        $subject = 'FinClears - ' . ($letter->title ?: 'Employee Letter');

        $body = '<p>Dear ' . e($employee->name) . ',</p>'
            . '<p>Please find your approved employee letter attached.</p>'
            . '<p>Regards,<br>FinClears HR Team</p>';

        try {
            $this->notificationService->email(
                $employee->email,
                $subject,
                $body,
                $employee->name,
                $pdfPath
            );
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to send letter email. Please try again.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Approved letter emailed successfully.',
        ]);
    }

    private function canAccessLetter(
        Request $request,
        EmployeeLetter $letter
    ): bool {
        $user = $request->user();

        if (! $user instanceof User || ! $letter->employeeProfile) {
            return false;
        }

        if (
            ! $this->employeeAccessScope->canAccess(
                $user,
                $letter->employeeProfile
            )
        ) {
            return false;
        }

        $isEmployee = $user->role === User::ROLE_EMPLOYEE
            || $user->hasRole('employee');

        return ! $isEmployee || $letter->status === 'issued';
    }
}
