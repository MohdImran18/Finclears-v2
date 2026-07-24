<?php

namespace App\Http\Requests\Company;

class UpdateCompanyRequest extends StoreCompanyRequest
{
    public function rules(): array
    {
        $rules = parent::rules();

        foreach ($rules as $key => $rule) {

            if (is_array($rule)) {

                $rules[$key] = array_map(
                    fn ($item) => $item === 'required' ? 'sometimes' : $item,
                    $rule
                );

            }

        }

        return $rules;
    }
}