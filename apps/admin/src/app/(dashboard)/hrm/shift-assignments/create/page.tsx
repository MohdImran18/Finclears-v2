"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Save,
  Loader2,
} from "lucide-react";

import {
  createEmployeeShiftAssignment,
} from "@/lib/api/hrm/employeeShiftAssignmentApi";

import { getEmployees } from "@/lib/api/employees/employeeApi";
import { getShifts, type Shift } from "@/lib/api/hrm/shiftApi";

type EmployeeOption = {
  id: number;
  employee_code?: string;
  user?: {
    name?: string;
    email?: string;
  };
};

export default function CreateShiftAssignmentPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [employeeId, setEmployeeId] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [isCurrent, setIsCurrent] = useState(true);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true);
        setError("");

        const [employeeResponse, shiftResponse] =
          await Promise.all([
            getEmployees({
              per_page: 200,
              status: "active",
            }),
            getShifts(true),
          ]);

        const employeeData =
          employeeResponse?.data?.data ??
          employeeResponse?.data ??
          [];

        setEmployees(employeeData as EmployeeOption[]);
        setShifts(shiftResponse.data || []);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load employees and shifts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }

    if (!shiftId) {
      setError("Please select a shift.");
      return;
    }

    if (!effectiveFrom) {
      setError("Please select an effective from date.");
      return;
    }

    if (
      effectiveTo &&
      effectiveTo < effectiveFrom
    ) {
      setError(
        "Effective To date cannot be before Effective From date."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createEmployeeShiftAssignment({
        employee_profile_id: Number(employeeId),
        shift_id: Number(shiftId),
        effective_from: effectiveFrom,
        effective_to: effectiveTo || null,
        is_current: isCurrent,
        notes: notes.trim() || null,
      });

      router.push("/hrm/shift-assignments");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create shift assignment."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedShift = shifts.find(
    (shift) => String(shift.id) === shiftId
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() =>
            router.push("/hrm/shift-assignments")
          }
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Shift Assignments
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">
          Assign Shift
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Assign a work shift to an employee.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border bg-white"
      >
        <div className="border-b px-6 py-5">
          <h2 className="font-semibold text-gray-900">
            Assignment Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select the employee, shift and assignment period.
          </p>
        </div>

        <div className="space-y-6 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-500">
              <Loader2
                size={18}
                className="mr-2 animate-spin"
              />
              Loading employees and shifts...
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Employee <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={employeeId}
                    onChange={(event) =>
                      setEmployeeId(event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                    required
                  >
                    <option value="">
                      Select employee
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.user?.name ||
                          employee.employee_code ||
                          `Employee #${employee.id}`}
                        {employee.employee_code
                          ? ` (${employee.employee_code})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Shift <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={shiftId}
                    onChange={(event) =>
                      setShiftId(event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                    required
                  >
                    <option value="">
                      Select shift
                    </option>

                    {shifts.map((shift) => (
                      <option
                        key={shift.id}
                        value={shift.id}
                      >
                        {shift.name} ({shift.code}){" "}
                        {shift.start_time} - {shift.end_time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedShift && (
                <div className="rounded-lg border bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <CalendarDays size={16} />
                    Selected Shift
                  </div>

                  <div className="mt-2 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                    <span>
                      <strong>Name:</strong>{" "}
                      {selectedShift.name}
                    </span>

                    <span>
                      <strong>Time:</strong>{" "}
                      {selectedShift.start_time} -{" "}
                      {selectedShift.end_time}
                    </span>

                    <span>
                      <strong>Break:</strong>{" "}
                      {selectedShift.break_duration_minutes} min
                    </span>
                  </div>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Effective From{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(event) =>
                      setEffectiveFrom(event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Effective To
                  </label>

                  <input
                    type="date"
                    value={effectiveTo}
                    min={effectiveFrom || undefined}
                    onChange={(event) =>
                      setEffectiveTo(event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank if the assignment has no end date.
                  </p>
                </div>
              </div>

              <div>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(event) =>
                      setIsCurrent(event.target.checked)
                    }
                    className="h-4 w-4"
                  />

                  <span>
                    <span className="block text-sm font-medium text-gray-700">
                      Set as current assignment
                    </span>

                    <span className="block text-xs text-gray-500">
                      This assignment will be treated as the
                      employee&apos;s current shift.
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={4}
                  placeholder="Add any notes about this shift assignment..."
                  className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={() =>
              router.push("/hrm/shift-assignments")
            }
            disabled={saving}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Save size={16} />
            )}

            {saving ? "Saving..." : "Save Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
}
