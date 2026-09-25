"use client";

import { useEffect, useState } from "react";

import type { EmployeePayload } from "@/types/employee/employee";
import { getUsers, type AdminUser } from "@/lib/api/users/userApi";
import {
  getDepartments,
  getDesignations,
  type DepartmentOption,
  type DesignationOption,
} from "@/lib/api/hrm/hrmApi";

interface EmployeeEmploymentFormProps {
  form: Partial<EmployeePayload>;
  setForm: React.Dispatch<React.SetStateAction<Partial<EmployeePayload>>>;
}

export default function EmployeeEmploymentForm({
  form,
  setForm,
}: EmployeeEmploymentFormProps) {
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [designations, setDesignations] = useState<DesignationOption[]>([]);
  const [reportingManagers, setReportingManagers] = useState<AdminUser[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [error, setError] = useState("");

  const update = (
    field: keyof EmployeePayload,
    value: string | number | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    let mounted = true;

    async function loadReportingManagers() {
      try {
        setLoadingManagers(true);

        const response = await getUsers({
          role: "employee",
          status: "active",
          per_page: 100,
        });

        if (mounted) {
          const users =
            response?.data?.data ??
            response?.data ??
            response?.users ??
            [];

          setReportingManagers(users);
        }
      } catch (err) {
        console.error("Failed to load reporting managers:", err);
      } finally {
        if (mounted) {
          setLoadingManagers(false);
        }
      }
    }

    loadReportingManagers();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadDepartments() {
      try {
        setLoadingDepartments(true);
        setError("");

        const response = await getDepartments();

        if (mounted) {
          setDepartments(response.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);

        if (mounted) {
          setError("Unable to load departments.");
        }
      } finally {
        if (mounted) {
          setLoadingDepartments(false);
        }
      }
    }

    loadDepartments();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadDesignations() {
      if (!form.department_id) {
        setDesignations([]);
        return;
      }

      try {
        setLoadingDesignations(true);

        const response = await getDesignations(
          Number(form.department_id)
        );

        if (mounted) {
          setDesignations(response.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load designations:", err);

        if (mounted) {
          setDesignations([]);
        }
      } finally {
        if (mounted) {
          setLoadingDesignations(false);
        }
      }
    }

    loadDesignations();

    return () => {
      mounted = false;
    };
  }, [form.department_id]);

  const handleDepartmentChange = (
    value: string
  ) => {
    const departmentId = value ? Number(value) : null;

    setForm((prev) => ({
      ...prev,
      department_id: departmentId,
      designation_id: null,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Employment Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Define department, designation and reporting structure.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">

        {/* Department */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Department
          </label>

          <select
            value={form.department_id ?? ""}
            disabled={loadingDepartments}
            onChange={(e) =>
              handleDepartmentChange(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#087f78] disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">
              {loadingDepartments
                ? "Loading departments..."
                : "Select department"}
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Designation
          </label>

          <select
            value={form.designation_id ?? ""}
            disabled={
              !form.department_id ||
              loadingDesignations
            }
            onChange={(e) =>
              update(
                "designation_id",
                e.target.value
                  ? Number(e.target.value)
                  : null
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#087f78] disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">
              {!form.department_id
                ? "Select department first"
                : loadingDesignations
                  ? "Loading designations..."
                  : "Select designation"}
            </option>

            {designations.map((designation) => (
              <option
                key={designation.id}
                value={designation.id}
              >
                {designation.name}
              </option>
            ))}
          </select>

          {form.department_id && !loadingDesignations && (
            <p className="mt-1.5 text-xs text-slate-400">
              Showing designations for the selected department.
            </p>
          )}
        </div>

        {/* Date of Joining */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Date of Joining
          </label>

          <input
            type="date"
            value={form.date_of_joining ?? ""}
            onChange={(e) =>
              update("date_of_joining", e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        {/* Employment Type */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Employment Type
          </label>

          <select
            value={form.employment_type ?? "full_time"}
            onChange={(e) =>
              update("employment_type", e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#087f78]"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </select>
        </div>

        {/* Work Location */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Work Location
          </label>

          <input
            value={form.work_location ?? ""}
            onChange={(e) =>
              update("work_location", e.target.value)
            }
            placeholder="Noida / Remote / Office"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        {/* Reporting Manager */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Reporting Manager
          </label>

          <select
            value={form.reporting_manager_id ?? ""}
            onChange={(e) =>
              update(
                "reporting_manager_id",
                e.target.value ? Number(e.target.value) : null
              )
            }
            disabled={loadingManagers}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">
              {loadingManagers
                ? "Loading reporting managers..."
                : "Select reporting manager"}
            </option>

            {!loadingManagers &&
              reportingManagers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                  {manager.email ? ` — ${manager.email}` : ""}
                </option>
              ))}
          </select>

          <p className="mt-1.5 text-xs text-slate-400">
            Select the employee's reporting manager.
          </p>
        </div>

      </div>
    </div>
  );
}
