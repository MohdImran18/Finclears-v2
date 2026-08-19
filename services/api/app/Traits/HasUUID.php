<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUUID
{
    protected static function bootHasUUID(): void
    {
        static::creating(function ($model) {

            if (
                property_exists($model, 'uuidColumn')
            ) {

                $column = $model->uuidColumn;

            } else {

                $column = 'uuid';

            }

            if (empty($model->{$column})) {

                $model->{$column} = (string) Str::uuid();

            }

        });
    }
}