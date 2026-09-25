<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LetterTemplate extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'letter_type',
        'subject',
        'content',
        'language',
        'is_active',
        'is_default',
        'version',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'version' => 'integer',
    ];

    public function fields(): HasMany
    {
        return $this->hasMany(
            LetterTemplateField::class,
            'letter_template_id'
        )->orderBy('display_order');
    }

    public function letters(): HasMany
    {
        return $this->hasMany(
            EmployeeLetter::class,
            'letter_template_id'
        );
    }
}
