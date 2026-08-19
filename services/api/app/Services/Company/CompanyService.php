<?php

namespace App\Services\Company;

use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompanyService
{
    public function paginate(
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator {

        $query = Company::query()
            ->with([
                'user',
                'directors',
                'shareholders',
                'documents',
            ]);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['company_type'])) {
            $query->where('company_type', $filters['company_type']);
        }

        if (!empty($filters['service_type'])) {
            $query->where('service_type', $filters['service_type']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('pan_number', 'like', "%{$search}%");
            });
        }

        return $query
            ->latest()
            ->paginate($perPage);
    }

    public function find(int|string $id): Company
    {
        return Company::query()
            ->with([
                'user',
                'directors',
                'shareholders',
                'documents',
            ])
            ->findOrFail($id);
    }

    public function create(array $data): Company
    {
        return DB::transaction(function () use ($data) {

            /*
             * Extract related data before creating company.
             */
            $promoters = $data['promoters'] ?? [];
            $shareholders = $data['shareholders'] ?? [];

            unset(
                $data['promoters'],
                $data['shareholders']
            );

            /*
             * Default values.
             */
            $data['user_id'] = $data['user_id'] ?? Auth::id();
            $data['status'] = $data['status'] ?? Company::STATUS_DRAFT;
            $data['payment_status'] = $data['payment_status'] ?? 'pending';

            /*
             * Create company.
             */
            $company = Company::create($data);

            /*
             * Create directors / promoters.
             */
            foreach ($promoters as $promoter) {

                $company->directors()->create([
                    'name' => $promoter['name'],
                    'email' => $promoter['email'] ?? null,
                    'phone' => $promoter['phone'] ?? null,
                    'pan' => $promoter['pan'] ?? null,
                    'aadhaar' => $promoter['aadhaar'] ?? null,
                    'din' => $promoter['din'] ?? null,
                    'designation' => $promoter['designation'] ?? null,
                ]);
            }

            /*
             * Create shareholders.
             */
            foreach ($shareholders as $shareholder) {

                $company->shareholders()->create([
                    'name' => $shareholder['name'],
                    'shares' => $shareholder['shares'] ?? 0,
                    'percentage' => $shareholder['percentage'] ?? 0,
                ]);
            }

            /*
             * Return complete company.
             */
            return $company->load([
                'user',
                'directors',
                'shareholders',
                'documents',
            ]);
        });
    }

    public function update(
        Company $company,
        array $data
    ): Company {

        return DB::transaction(function () use ($company, $data) {

            $promoters = $data['promoters'] ?? null;
            $shareholders = $data['shareholders'] ?? null;

            unset(
                $data['promoters'],
                $data['shareholders']
            );

            $company->update($data);

            /*
             * Replace directors only when supplied.
             */
            if ($promoters !== null) {

                $company->directors()->delete();

                foreach ($promoters as $promoter) {
                    $company->directors()->create([
                        'name' => $promoter['name'],
                        'email' => $promoter['email'] ?? null,
                        'phone' => $promoter['phone'] ?? null,
                        'pan' => $promoter['pan'] ?? null,
                        'aadhaar' => $promoter['aadhaar'] ?? null,
                        'din' => $promoter['din'] ?? null,
                        'designation' => $promoter['designation'] ?? null,
                    ]);
                }
            }

            /*
             * Replace shareholders only when supplied.
             */
            if ($shareholders !== null) {

                $company->shareholders()->delete();

                foreach ($shareholders as $shareholder) {
                    $company->shareholders()->create([
                        'name' => $shareholder['name'],
                        'shares' => $shareholder['shares'] ?? 0,
                        'percentage' => $shareholder['percentage'] ?? 0,
                    ]);
                }
            }

            return $company->fresh([
                'user',
                'directors',
                'shareholders',
                'documents',
            ]);
        });
    }

    public function submit(Company $company): Company
    {
        return DB::transaction(function () use ($company) {

            $company->update([
                'status' => Company::STATUS_PENDING,
                'submitted_at' => now(),
            ]);

            return $company->fresh([
                'user',
                'directors',
                'shareholders',
                'documents',
            ]);
        });
    }

    public function delete(Company $company): bool
    {
        return (bool) $company->delete();
    }
}
