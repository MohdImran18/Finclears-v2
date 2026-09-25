"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  Users,
  Clock3,
} from "lucide-react";

import {
  getEmployeeShiftAssignments,
  deleteEmployeeShiftAssignment,
  type ShiftAssignment,
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

export default function ShiftAssignmentsPage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [currentOnly, setCurrentOnly] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [assignmentResponse, employeeResponse, shiftResponse] =
        await Promise.all([
          getEmployeeShiftAssignments(),
          getEmployees({
            per_page: 200,
            status: "active",
          }),
          getShifts(true),
        ]);

      setAssignments(assignmentResponse.data || []);

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
          "Failed to load shift assignments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const employee =
        assignment.employeeProfile ??
        assignment.employee_profile;

      const employeeName =
        employee?.user?.name?.toLowerCase() || "";

      const employeeCode =
        employee?.employee_code?.toLowerCase() || "";

      const shiftName =
        assignment.shift?.name?.toLowerCase() || "";

      const shiftCode =
        assignment.shift?.code?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        employeeName.includes(query) ||
        employeeCode.includes(query) ||
        shiftName.includes(query) ||
        shiftCode.includes(query);

      const matchesEmployee =
        !employeeFilter ||
        String(assignment.employee_profile_id) === employeeFilter;

      const matchesShift =
        !shiftFilter ||
        String(assignment.shift_id) === shiftFilter;

      const matchesCurrent =
        !currentOnly || assignment.is_current;

      return (
        matchesSearch &&
        matchesEmployee &&
        matchesShift &&
        matchesCurrent
      );
    });
  }, [
    assignments,
    search,
    employeeFilter,
    shiftFilter,
    currentOnly,
  ]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shift assignment?"
    );

    if (!confirmed) return;

    try {
      await deleteEmployeeShiftAssignment(id);
      await loadData();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete shift assignment."
      );
    }
  }

  function employeeName(assignment: ShiftAssignment) {
    const employee =
      assignment.employeeProfile ??
      assignment.employee_profile;

    return (
      employee?.user?.name ||
      employee?.employee_code ||
      `Employee #${assignment.employee_profile_id}`
    );
  }

  function employeeCode(assignment: ShiftAssignment) {
    const employee =
      assignment.employeeProfile ??
      assignment.employee_profile;

    return employee?.employee_code || "—";
  }

  function formatDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Shift Assignments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Assign shifts to employees and manage their effective dates.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push("/hrm/shift-assignments/create")
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={17} />
          Assign Shift
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Assignments</p>
              <p className="text-xl font-semibold">
                {assignments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <Clock3 size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Current</p>
              <p className="text-xl font-semibold">
                {assignments.filter((item) => item.is_current).length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div>
            <p className="text-xs text-gray-500">Available Shifts</p>
            <p className="text-xl font-semibold">
              {shifts.length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto_auto]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employee or shift..."
              className="w-full rounded-lg border px-9 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <select
            value={employeeFilter}
            onChange={(event) =>
              setEmployeeFilter(event.target.value)
            }
            className="rounded-lg border px-3 py-2.5 text-sm outline-none"
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.user?.name ||
                  employee.employee_code ||
                  `Employee #${employee.id}`}
              </option>
            ))}
          </select>

          <select
            value={shiftFilter}
            onChange={(event) =>
              setShiftFilter(event.target.value)
            }
            className="rounded-lg border px-3 py-2.5 text-sm outline-none"
          >
            <option value="">All Shifts</option>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name} ({shift.code})
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm">
            <input
              type="checkbox"
              checked={currentOnly}
              onChange={(event) =>
                setCurrentOnly(event.target.checked)
              }
            />
            Current only
          </label>

          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Employee
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Shift
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Effective From
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Effective To
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Loading shift assignments...
                  </td>
                </tr>
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No shift assignments found.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">
                        {employeeName(assignment)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employeeCode(assignment)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">
                        {assignment.shift?.name ||
                          `Shift #${assignment.shift_id}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {assignment.shift?.code || "—"}
                        {assignment.shift?.start_time &&
                          assignment.shift?.end_time
                          ? ` · ${assignment.shift.start_time} - ${assignment.shift.end_time}`
                          : ""}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatDate(assignment.effective_from)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatDate(assignment.effective_to)}
                    </td>

                    <td className="px-5 py-4">
                      {assignment.is_current ? (
                        <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          Current
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          Historical
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            router.push(
                              `/hrm/shift-assignments/${assignment.id}/edit`
                            )
                          }
                          className="rounded-lg border p-2 hover:bg-gray-50"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() =>
                            handleDelete(assignment.id)
                          }
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
