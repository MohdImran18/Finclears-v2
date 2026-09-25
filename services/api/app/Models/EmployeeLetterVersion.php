<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeLetterVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_letter_id',
        'version',
        'rendered_content',
        'field_values',
        'pdf_path',
        'created_by',
        'change_notes',
    ];

    protected $casts = [
        'version' => 'integer',
        'field_values' => 'array',
    ];

    public function letter(): BelongsTo
    {
        return $this->belongsTo(
            EmployeeLetter::class,
            'employee_letter_id'
        );
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}
