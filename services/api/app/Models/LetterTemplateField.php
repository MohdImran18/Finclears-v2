<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterTemplateField extends Model
{
    use HasFactory;

    protected $fillable = [
        'letter_template_id',
        'field_key',
        'field_label',
        'field_type',
        'source',
        'default_value',
        'is_required',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(
            LetterTemplate::class,
            'letter_template_id'
        );
    }
}
