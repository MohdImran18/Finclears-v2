<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class BaseModel extends Model
{
    use SoftDeletes;

    /**
     * Mass assignment
     */
    protected $guarded = [];

    /**
     * Date serialization
     */
    protected function serializeDate(
        \DateTimeInterface $date
    ): string {
        return $date->format('Y-m-d H:i:s');
    }
}