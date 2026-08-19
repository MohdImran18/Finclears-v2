<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,

            'company_name' => $this->company_name,
            'company_type' => $this->company_type,
            'service_type' => $this->service_type,

            'business_activity' => $this->business_activity,

            'authorized_capital' => $this->authorized_capital,
            'paid_up_capital' => $this->paid_up_capital,

            'state' => $this->state,
            'city' => $this->city,
            'address' => $this->address,
            'pin_code' => $this->pin_code,

            'cin' => $this->cin,
            'llpin' => $this->llpin,
            'pan_number' => $this->pan_number,
            'tan_number' => $this->tan_number,
            'gst_number' => $this->gst_number,

            'email' => $this->email,
            'phone' => $this->phone,
            'website' => $this->website,

            'status' => $this->status,
            'payment_status' => $this->payment_status,

            'incorporation_date' => $this->incorporation_date,

            'directors' => $this->whenLoaded(
                'directors'
            ),

            'shareholders' => $this->whenLoaded(
                'shareholders'
            ),

            'documents' => $this->whenLoaded(
                'documents'
            ),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
