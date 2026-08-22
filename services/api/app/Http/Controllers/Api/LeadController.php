<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lead\StoreLeadRequest;
use App\Http\Requests\Lead\UpdateLeadRequest;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with([
            'service:id,title',
            'source:id,name',
            'assignedUser:id,name,email',
        ]);

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $perPage = min(
            max((int) $request->get('per_page', 20), 1),
            100
        );

        $leads = $query
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Leads fetched successfully.',
            'data' => $leads,
        ]);
    }

    public function store(StoreLeadRequest $request)
    {
        $validated = $request->validated();

        $lead = Lead::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully.',
            'data' => [
                'lead' => $lead->load([
                    'service:id,title',
                    'source:id,name',
                    'assignedUser:id,name,email',
                ]),
            ],
        ], 201);
    }
    public function show(Lead $lead)
    {
        $lead->load([
            'service:id,title',
            'source:id,name',
            'assignedUser:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead fetched successfully.',
            'data' => [
                'lead' => $lead,
            ],
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead)
    {
        $lead->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully.',
            'data' => [
                'lead' => $lead->fresh()->load([
                    'service:id,title',
                    'source:id,name',
                    'assignedUser:id,name,email',
                ]),
            ],
        ]);
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully.',
        ]);
    }
}

