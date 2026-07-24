<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'name' => $this->name,

            'slug' => $this->slug,

            'icon' => $this->icon,

            'image' => $this->image,

            'description' => $this->description,

            'is_featured' => (bool) $this->is_featured,

            'status' => (bool) $this->status,

            'sort_order' => $this->sort_order,

        ];
    }
}