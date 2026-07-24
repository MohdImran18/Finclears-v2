<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicePricingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'title' => $this->title,

            'price' => $this->price,

            'description' => $this->description,

            'is_popular' => (bool) $this->is_popular,

            'sort_order' => $this->sort_order,

        ];
    }
}