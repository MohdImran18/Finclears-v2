<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $blog = $this->route('blog');

        $blogId = is_object($blog) ? $blog->id : $blog;

        return [
            'blog_category_id' => [
                'required',
                'integer',
                'exists:blog_categories,id',
            ],

            'user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('blogs', 'slug')->ignore($blogId),
            ],

            'featured_image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'excerpt' => [
                'nullable',
                'string',
            ],

            'content' => [
                'required',
                'string',
            ],

            'reading_time' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'author_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'published_at' => [
                'nullable',
                'date',
            ],

            'meta_title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'meta_description' => [
                'nullable',
                'string',
            ],

            'meta_keywords' => [
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