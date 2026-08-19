<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'title' => $this->title,

            'slug' => $this->slug,

            'featured_image' => $this->featured_image,

            'excerpt' => $this->excerpt,

            'content' => $this->content,

            'reading_time' => $this->reading_time,

            'author_name' => $this->author_name,

            'published_at' => $this->published_at,

            'views' => $this->views,

            'is_featured' => $this->is_featured,

            'status' => $this->status,

            'meta_title' => $this->meta_title,

            'meta_description' => $this->meta_description,

            'meta_keywords' => $this->meta_keywords,

            'category' => $this->whenLoaded(
                'category'
            ),

            'tags' => $this->whenLoaded(
                'tags'
            ),

            'comments' => $this->whenLoaded(
                'comments'
            ),

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}