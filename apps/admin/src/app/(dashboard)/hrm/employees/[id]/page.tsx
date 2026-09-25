"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getEmployee,
} from "@/lib/api/employees/employeeApi";

import { getEmployeeAttendance } from "@/lib/api/attendance/attendanceApi";

import type { Employee } from "@/types/employee/employee";
import type { Attendance } from "@/types/attendance/attendance";
import EmployeeDocuments from "./components/documents/EmployeeDocuments";

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");


  useEffect(() => {
    let mounted = true;

    async function loadAttendance() {
      try {
        setAttendanceLoading(true);
        setAttendanceError("");

        const response = await getEmployeeAttendance(Number(id));

        if (mounted) {
          setAttendance(response?.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load attendance:", err);

        if (mounted) {
          setAttendanceError(
            err instanceof Error
              ? err.message
              : "Unable to load attendance."
          );
        }
      } finally {
        if (mounted) {
          setAttendanceLoading(false);
        }
      }
    }
    async function loadEmployee() {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployee(id);

        if (mounted) {
          setEmployee(response?.data?.employee ?? null);
        }
      } catch (err) {
        console.error("Failed to load employee:", err);

        if (mounted) {
          setError("Unable to load employee details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadEmployee();
      loadAttendance();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          Loading employee profile...
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
          <p className="font-semibold text-red-600">
            {error || "Employee not found."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/hrm/employees")}
            className="mt-4 rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  const user = employee.user;
  const department = employee.department;
  const designation = employee.designation;
  const manager = employee.reporting_manager;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#087f78]">
              HR Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Employee Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View employee information and HR details.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/hrm/employees")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => router.push(`/hrm/employees/${employee.id}/edit`)}
              className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#066b65]"
            >
              Edit Employee
            </button>
          </div>
        </div>

        {/* Employee Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e8f7f5] text-xl font-bold text-[#087f78]">
              {(user?.name || "E").charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">
                {user?.name || "Employee"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user?.email || "No email available"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {employee.employee_code}
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {employee.status || "active"}
                </span>

                {department && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {department.name}
                  </span>
                )}

                {designation && (
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    {designation.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Employment */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Employment Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Info label="Employee Code" value={employee.employee_code} />
            <Info label="Department" value={department?.name} />
            <Info label="Designation" value={designation?.name} />
            <Info label="Joining Date" value={employee.date_of_joining} />
            <Info label="Employment Type" value={employee.employment_type} />
            <Info label="Work Location" value={employee.work_location} />
            <Info label="Reporting Manager" value={manager?.name} />
            <Info label="Manager Email" value={manager?.email} />
            <Info label="Status" value={employee.status} />
          </div>
        </section>

        {/* Personal */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Personal Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Info label="Date of Birth" value={employee.date_of_birth} />
            <Info label="Gender" value={employee.gender} />
            <Info label="Personal Email" value={employee.personal_email} />
            <Info label="Personal Phone" value={employee.personal_phone} />
            <Info label="Phone" value={user?.phone} />
            <Info label="Address" value={employee.address} />
            <Info label="City" value={employee.city} />
            <Info label="State" value={employee.state} />
            <Info label="Pincode" value={employee.pincode} />
          </div>
        </section>

        {/* Emergency */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Emergency Contact
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Info
              label="Contact Name"
              value={employee.emergency_contact_name}
            />
            <Info
              label="Contact Phone"
              value={employee.emergency_contact_phone}
            />
            <Info
              label="Relationship"
              value={employee.emergency_contact_relation}
            />
          </div>
        </section>

        {/* Identity & Banking */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Identity & Banking
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Info label="PAN Number" value={employee.pan_number} />
            <Info label="Aadhaar Number" value={employee.aadhaar_number} />
            <Info
              label="Account Holder"
              value={employee.account_holder_name}
            />
            <Info
              label="Bank Account"
              value={employee.bank_account_number}
            />
            <Info label="Bank Name" value={employee.bank_name} />
            <Info label="IFSC Code" value={employee.ifsc_code} />
          </div>
        </section>

        {/* Notes */}
        {employee.notes && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Notes
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {employee.notes}
            </p>
          </section>
        )}


        {/* Employee Documents */}
        <EmployeeDocuments employeeProfileId={employee.id} />
        {/* Attendance History */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Attendance History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee attendance, working hours and overtime records.
              </p>
            </div>

            {!attendanceLoading && (
              <span className="text-sm font-semibold text-slate-500">
                {attendance.length} record{attendance.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {attendanceLoading && (
            <div className="mt-5 rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
              Loading attendance...
            </div>
          )}

          {attendanceError && !attendanceLoading && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {attendanceError}
            </div>
          )}

          {!attendanceLoading &&
            !attendanceError &&
            attendance.length === 0 && (
              <div className="mt-5 rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
                No attendance records found.
              </div>
            )}

          {!attendanceLoading &&
            !attendanceError &&
            attendance.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-3 font-semibold">
                        Date
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        Check In
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        Check Out
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        Working
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        Late
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        Early
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        Overtime
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((record) => {
                      const workingHours = Math.floor(
                        record.working_minutes / 60
                      );

                      const workingMinutes =
                        record.working_minutes % 60;

                      return (
                        <tr
                          key={record.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-3 py-4 font-medium text-slate-900">
                            {record.attendance_date
                              ? new Date(
                                  record.attendance_date
                                ).toLocaleDateString()
                              : "-"}
                          </td>

                          <td className="px-3 py-4 text-slate-600">
                            {record.check_in_at
                              ? new Date(
                                  record.check_in_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </td>

                          <td className="px-3 py-4 text-slate-600">
                            {record.check_out_at
                              ? new Date(
                                  record.check_out_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </td>

                          <td className="px-3 py-4 text-slate-600">
                            {workingHours}h {workingMinutes}m
                          </td>

                          <td className="px-3 py-4 text-slate-600">
                            {record.late_minutes}m
                          </td>

                          <td className="px-3 py-4 text-slate-600">
                            {record.early_departure_minutes}m
                          </td>

                          <td className="px-3 py-4 font-semibold text-slate-700">
                            {record.overtime_minutes}m
                          </td>

                          <td className="px-3 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                              {record.status.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || "Ã¢â‚¬â€"}
      </p>
    </div>
  );
}
