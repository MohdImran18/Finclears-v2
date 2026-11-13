<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'title' => $this->document_name,

            'description' => $this->description,

            'required' => (bool) $this->is_required,

            'sort_order' => $this->sort_order,

        ];
    }
}