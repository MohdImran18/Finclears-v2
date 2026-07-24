<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'blog_category_id',
        'user_id',
        'title',
        'slug',
        'featured_image',
        'excerpt',
        'content',
        'reading_time',
        'author_name',
        'published_at',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'views',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'status' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function tags()
    {
        return $this->hasMany(BlogTag::class);
    }

    public function comments()
    {
        return $this->hasMany(BlogComment::class);
    }

    public function views()
    {
        return $this->hasMany(BlogView::class);
    }

    public function likes()
    {
        return $this->hasMany(BlogLike::class);
    }
}