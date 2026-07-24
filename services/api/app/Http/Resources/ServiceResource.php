<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            'id' => $this->id,

            'category' => $this->whenLoaded(
                'category',
                fn () => [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                ]
            ),

            'title' => $this->title,

            'slug' => $this->slug,

            'code' => $this->code,

            'icon' => $this->icon,

            'featured_image' => $this->featured_image,

            'banner_image' => $this->banner_image,

            'short_description' => $this->short_description,

            'description' => $this->description,

            /*
            |--------------------------------------------------------------------------
            | Pricing
            |--------------------------------------------------------------------------
            */

            'starting_price' => $this->starting_price,

            'price_label' => $this->price_label,

            'processing_days' => $this->processing_days,

            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            'meta_title' => $this->meta_title,

            'meta_description' => $this->meta_description,

            'meta_keywords' => $this->meta_keywords,

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'is_featured' => (bool) $this->is_featured,

            'is_popular' => (bool) $this->is_popular,

            'status' => (bool) $this->status,

            'sort_order' => $this->sort_order,

            /*
            |--------------------------------------------------------------------------
            | Statistics
            |--------------------------------------------------------------------------
            */

            'views' => $this->views,

            'orders' => $this->orders,

            /*
            |--------------------------------------------------------------------------
            | Relations
            |--------------------------------------------------------------------------
            */

            'benefits' => ServiceBenefitResource::collection(
                $this->whenLoaded('benefits')
            ),

            'processes' => ServiceProcessResource::collection(
                $this->whenLoaded('processes')
            ),

            'documents' => ServiceDocumentResource::collection(
                $this->whenLoaded('documents')
            ),

            'pricing' => ServicePricingResource::collection(
                $this->whenLoaded('pricing')
            ),

            'faqs' => ServiceFaqResource::collection(
                $this->whenLoaded('faqs')
            ),

            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */

            'created_at' => $this->created_at?->toISOString(),

            'updated_at' => $this->updated_at?->toISOString(),

        ];
    }
}