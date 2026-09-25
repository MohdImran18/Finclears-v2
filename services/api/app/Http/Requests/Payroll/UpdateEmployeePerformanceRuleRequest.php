<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeePerformanceRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rule = $this->route('performanceRule');

        return [
            'employee_profile_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:employee_profiles,id',
            ],

            'name' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],

            'code' => [
                'sometimes',
                'required',
                'string',
                'max:80',
                'alpha_dash',
                Rule::unique(
                    'employee_performance_rules',
                    'code'
                )
                    ->ignore($rule)
                    ->where(function ($query) {
                        return $query->where(
                            'employee_profile_id',
                            $this->input(
                                'employee_profile_id',
                                $this->route('performanceRule')
                                    ?->employee_profile_id
                            )
                        );
                    })
                    ->withoutTrashed(),
            ],

            'metric_type' => [
                'sometimes',
                'required',
                'string',
                'max:40',
            ],

            'period_type' => [
                'sometimes',
                'required',
                'string',
                'max:30',
            ],

            'target_value' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'minimum_target' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'maximum_target' => [
                'nullable',
                'numeric',
                'min:0',
                'gte:minimum_target',
            ],

            'minimum_achievement_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:10000',
            ],

            'maximum_achievement_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:10000',
                'gte:minimum_achievement_percentage',
            ],

            'incentive_type' => [
                'nullable',
                Rule::in([
                    'fixed',
                    'percentage',
                    'slab',
                ]),
            ],

            'incentive_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'incentive_slabs' => [
                'nullable',
                'array',
            ],

            'deduction_type' => [
                'nullable',
                Rule::in([
                    'fixed',
                    'percentage',
                    'slab',
                ]),
            ],

            'deduction_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'deduction_slabs' => [
                'nullable',
                'array',
            ],

            'loss_deduction_enabled' => [
                'sometimes',
                'boolean',
            ],

            'loss_deduction_type' => [
                'nullable',
                'string',
                'max:30',
            ],

            'loss_deduction_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'attendance_deduction_enabled' => [
                'sometimes',
                'boolean',
            ],

            'attendance_deduction_type' => [
                'nullable',
                'string',
                'max:30',
            ],

            'attendance_deduction_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'minimum_incentive' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'maximum_incentive' => [
                'nullable',
                'numeric',
                'min:0',
                'gte:minimum_incentive',
            ],

            'minimum_deduction' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'maximum_deduction' => [
                'nullable',
                'numeric',
                'min:0',
                'gte:minimum_deduction',
            ],

            'effective_from' => [
                'nullable',
                'date',
            ],

            'effective_to' => [
                'nullable',
                'date',
                'after_or_equal:effective_from',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
