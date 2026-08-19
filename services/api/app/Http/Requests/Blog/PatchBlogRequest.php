<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatchBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $blog = $this->route('blog');

        $blogId = is_object($blog)
            ? $blog->id
            : $blog;

        return [
            'blog_category_id' => [
                'sometimes',
                'integer',
                'exists:blog_categories,id',
            ],

            'user_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'title' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('blogs', 'slug')->ignore($blogId),
            ],

            'featured_image' => [
                'sometimes',
                'nullable',
                'string',
                'max:2048',
            ],

            'excerpt' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'content' => [
                'sometimes',
                'string',
            ],

            'reading_time' => [
                'sometimes',
                'nullable',
                'integer',
                'min:1',
            ],

            'author_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'published_at' => [
                'sometimes',
                'nullable',
                'date',
            ],

            'meta_title' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'meta_description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'meta_keywords' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'is_featured' => [
                'sometimes',
                'boolean',
            ],

            'status' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
}