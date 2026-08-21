<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'alternate_phone' => ['nullable', 'string', 'max:30'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'service_id' => ['nullable', 'exists:services,id'],
            'source_id' => ['nullable', 'exists:lead_sources,id'],
            'status' => ['nullable', 'string', 'max:30'],
            'priority' => ['nullable', 'string', 'max:20'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'estimated_value' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'next_follow_up_at' => ['nullable', 'date'],
        ]);

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
