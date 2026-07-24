<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BlogTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'blog_id',
        'name',
        'slug',
    ];

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }
}