<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeLetter extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'employee_profile_id',
        'letter_template_id',
        'letter_type',
        'letter_number',
        'title',
        'letter_date',
        'effective_date',
        'status',
        'rendered_content',
        'field_values',
        'pdf_path',
        'generated_at',
        'generated_by',
        'approved_by',
        'approved_at',
        'notes',
    ];

    protected $casts = [
        'letter_date' => 'date',
        'effective_date' => 'date',
        'field_values' => 'array',
        'generated_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function employeeProfile(): BelongsTo
    {
        return $this->belongsTo(
            EmployeeProfile::class,
            'employee_profile_id'
        );
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(
            LetterTemplate::class,
            'letter_template_id'
        );
    }

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'generated_by'
        );
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'approved_by'
        );
    }

    public function versions(): HasMany
    {
        return $this->hasMany(
            EmployeeLetterVersion::class,
            'employee_letter_id'
        )->orderByDesc('version');
    }
}
