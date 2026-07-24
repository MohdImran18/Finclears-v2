<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id'=>$this->id,

            'uuid'=>$this->uuid,

            'company_name'=>$this->company_name,

            'company_type'=>$this->company_type,

            'service_type'=>$this->service_type,

            'status'=>$this->status,

            'payment_status'=>$this->payment_status,

            'state'=>$this->state,

            'city'=>$this->city,

            'created_at'=>$this->created_at,

            'updated_at'=>$this->updated_at,

        ];
    }
}