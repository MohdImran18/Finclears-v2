<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class EmployeeSelfAttendanceController extends Controller
{
    public function __construct(
        protected AttendanceController $attendanceController
    ) {
    }

    private function validateVerification(Request $request): array
    {
        return $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'accuracy' => ['required', 'numeric', 'min:0', 'max:1000'],
        ]);
    }

    private function employeeId(Request $request): int
    {
        $employee = $request->user()?->employeeProfile;

        if (! $employee) {
            abort(403, 'Your login is not linked to an employee profile.');
        }

        return (int) $employee->id;
    }

    private function submit(
        Request $request,
        string $action,
        array $validated,
        int $employeeId
    ): JsonResponse {
        $photoPath = null;

        try {
            $photoPath = $request->file('photo')->store('attendance', 'private');

            if (! $photoPath) {
                throw new \RuntimeException('Unable to store attendance photo.');
            }

            $response = DB::transaction(function () use (
                $request,
                $action,
                $validated,
                $employeeId,
                $photoPath
            ) {
                $isCheckIn = $action === 'check-in';

                $request->merge([
                    'employee_profile_id' => $employeeId,
                    'attendance_date' => now('Asia/Kolkata')->toDateString(),
                    $isCheckIn ? 'check_in_at' : 'check_out_at' => now('UTC')->toDateTimeString(),
                    $isCheckIn ? 'check_in_source' : 'check_out_source' => 'self_service',
                ]);

                $result = $isCheckIn
                    ? $this->attendanceController->checkIn($request)
                    : $this->attendanceController->checkOut($request);

                if ($result->getStatusCode() >= 400) {
                    return $result;
                }

                $payload = $result->getData(true);
                $attendanceId = $payload['data']['id'] ?? null;

                if (! $attendanceId) {
                    throw new \RuntimeException('Attendance record ID missing.');
                }

                $attendance = Attendance::where('employee_profile_id', $employeeId)
                    ->findOrFail($attendanceId);

                $prefix = $isCheckIn ? 'check_in' : 'check_out';

                $attendance->update([
                    "{$prefix}_photo_path" => $photoPath,
                    "{$prefix}_latitude" => $validated['latitude'],
                    "{$prefix}_longitude" => $validated['longitude'],
                    "{$prefix}_accuracy" => $validated['accuracy'],
                    "{$prefix}_ip" => $request->ip(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => $isCheckIn
                        ? 'Check-in completed with photo and location verification.'
                        : 'Check-out completed with photo and location verification.',
                    'data' => $attendance->fresh([
                        'employeeProfile:id,employee_code,user_id',
                        'employeeProfile.user:id,name,email',
                        'shift',
                    ]),
                ], $isCheckIn ? 201 : 200);
            });

            if ($response->getStatusCode() >= 400) {
                Storage::disk('private')->delete($photoPath);
            }

            return $response;
        } catch (Throwable $exception) {
            if ($photoPath) {
                Storage::disk('private')->delete($photoPath);
            }

            throw $exception;
        }
    }

    public function checkIn(Request $request): JsonResponse
    {
        $validated = $this->validateVerification($request);

        return $this->submit(
            $request,
            'check-in',
            $validated,
            $this->employeeId($request)
        );
    }

    public function checkOut(Request $request): JsonResponse
    {
        $validated = $this->validateVerification($request);

        return $this->submit(
            $request,
            'check-out',
            $validated,
            $this->employeeId($request)
        );
    }
}
