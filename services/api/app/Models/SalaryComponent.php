<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalaryComponent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'type',
        'calculation_type',
        'calculation_basis',
        'default_value',
        'default_percentage',
        'minimum_amount',
        'maximum_amount',
        'is_variable',
        'is_taxable',
        'is_statutory',
        'is_reimbursement',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'default_value' => 'decimal:2',
        'default_percentage' => 'decimal:4',
        'minimum_amount' => 'decimal:2',
        'maximum_amount' => 'decimal:2',

        'is_variable' => 'boolean',
        'is_taxable' => 'boolean',
        'is_statutory' => 'boolean',
        'is_reimbursement' => 'boolean',
        'is_active' => 'boolean',

        'display_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeEarnings($query)
    {
        return $query->where('type', 'earning');
    }

    public function scopeDeductions($query)
    {
        return $query->where('type', 'deduction');
    }

    public function scopeVariable($query)
    {
        return $query->where('is_variable', true);
    }
}
