<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department_id',
        'designation_id',
        'employee_code',
        'date_of_joining',
        'date_of_birth',
        'gender',
        'employment_type',
        'work_location',
        'reporting_manager_id',
        'personal_email',
        'personal_phone',
        'address',
        'city',
        'state',
        'pincode',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'pan_number',
        'aadhaar_number',
        'bank_account_number',
        'bank_name',
        'ifsc_code',
        'account_holder_name',
        'status',
        'notes',
    ];

    protected $casts = [
        'date_of_joining' => 'date',
        'date_of_birth' => 'date',
    ];

    protected $hidden = [
        'pan_number',
        'aadhaar_number',
        'bank_account_number',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }


    public function salaryStructures()
    {
        return $this->hasMany(
            EmployeeSalaryStructure::class,
            'employee_profile_id'
        );
    }
    public function reportingManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporting_manager_id');
    }
    public function documents()
    {
        return $this->hasMany(
            EmployeeDocument::class,
            'employee_profile_id'
        );
    }
}
