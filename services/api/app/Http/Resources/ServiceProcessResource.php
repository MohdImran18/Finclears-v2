<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceProcessResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'step_no' => $this->step_no,

            'title' => $this->title,

            'description' => $this->description,

            'icon' => $this->icon,

        ];
    }
}