"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getEmployee,
  updateEmployee,
} from "@/lib/api/employees/employeeApi";

import type {
  Employee,
  EmployeePayload,
} from "@/types/employee/employee";

import EmployeeStepper from "@/app/(dashboard)/hrm/employees/create/components/EmployeeStepper";
import EmployeeAccountForm from "@/app/(dashboard)/hrm/employees/create/components/EmployeeAccountForm";
import EmployeeEmploymentForm from "@/app/(dashboard)/hrm/employees/create/components/EmployeeEmploymentForm";
import EmployeePersonalForm from "@/app/(dashboard)/hrm/employees/create/components/EmployeePersonalForm";
import EmployeeEmergencyForm from "@/app/(dashboard)/hrm/employees/create/components/EmployeeEmergencyForm";
import EmployeePayrollForm from "@/app/(dashboard)/hrm/employees/create/components/EmployeePayrollForm";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<Partial<EmployeePayload>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEmployee() {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployee(id);

        if (!mounted) return;

        const data = response?.data?.employee;

        if (!data) {
          throw new Error("Employee data not found.");
        }

        setEmployee(data);

        setForm({
          name: data.user?.name ?? "",
          email: data.user?.email ?? "",
          phone: data.user?.phone ?? "",

          department_id: data.department_id ?? null,
          designation_id: data.designation_id ?? null,
          employee_code: data.employee_code ?? "",

          date_of_joining: data.date_of_joining ?? null,
          date_of_birth: data.date_of_birth ?? null,
          gender: data.gender ?? null,
          employment_type: data.employment_type ?? null,
          work_location: data.work_location ?? null,
          reporting_manager_id: data.reporting_manager_id ?? null,

          personal_email: data.personal_email ?? null,
          personal_phone: data.personal_phone ?? null,

          address: data.address ?? null,
          city: data.city ?? null,
          state: data.state ?? null,
          pincode: data.pincode ?? null,

          emergency_contact_name:
            data.emergency_contact_name ?? null,
          emergency_contact_phone:
            data.emergency_contact_phone ?? null,
          emergency_contact_relation:
            data.emergency_contact_relation ?? null,

          pan_number: data.pan_number ?? null,
          aadhaar_number: data.aadhaar_number ?? null,
          bank_account_number:
            data.bank_account_number ?? null,
          bank_name: data.bank_name ?? null,
          ifsc_code: data.ifsc_code ?? null,
          account_holder_name:
            data.account_holder_name ?? null,

          status: data.status ?? "active",
          notes: data.notes ?? null,
        });
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

    loadEmployee();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: Partial<EmployeePayload> = {
        ...form,
      };

      // Do not send an empty password while editing.
      if (!payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }

      await updateEmployee(id, payload);

      setSuccess("Employee updated successfully.");

      setTimeout(() => {
        router.push("/hrm/employees");
      }, 800);
    } catch (err) {
      console.error("Failed to update employee:", err);
      setError("Unable to update employee. Please check the details.");
    } finally {
      setSaving(false);
    }
  };

  const goNext = () => {
    setCurrentStep((step) => Math.min(step + 1, 5));
  };

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-sm font-semibold text-slate-600 shadow-sm">
          Loading employee...
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold text-red-700">
          Employee not found
        </h2>

        <p className="mt-1 text-sm text-red-600">
          {error || "The requested employee could not be loaded."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/hrm/employees")}
          className="mt-4 rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white"
        >
          &larr; Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <button
            type="button"
            onClick={() => router.push("/hrm/employees")}
            className="mb-2 text-sm font-semibold text-slate-500 hover:text-[#087f78]"
          >
            &larr; Back to Employees
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Edit Employee
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update employee information across all HR modules.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
          <p className="text-xs font-medium text-slate-400">
            Employee Code
          </p>
          <p className="text-sm font-bold text-slate-800">
            {employee.employee_code}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <EmployeeStepper
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* Current module */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {currentStep === 1 && (
          <EmployeeAccountForm
            form={form}
            setForm={setForm}
          />
        )}

        {currentStep === 2 && (
          <EmployeeEmploymentForm
            form={form}
            setForm={setForm}
          />
        )}

        {currentStep === 3 && (
          <EmployeePersonalForm
            form={form}
            setForm={setForm}
          />
        )}

        {currentStep === 4 && (
          <EmployeeEmergencyForm
            form={form}
            setForm={setForm}
          />
        )}

        {currentStep === 5 && (
          <EmployeePayrollForm
            form={form}
            setForm={setForm}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            if (currentStep === 1) {
              router.push("/hrm/employees");
            } else {
              goPrevious();
            }
          }}
          disabled={saving}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {currentStep === 1 ? "Cancel" : "&larr; Previous"}
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={saving}
            className="rounded-xl bg-[#087f78] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65] disabled:opacity-50"
          >
            Save & Continue &rarr;
          </button>
        ) : (
          <button
            type="button"
            onClick={handleUpdate}
            disabled={saving}
            className="rounded-xl bg-[#087f78] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Updating Employee..." : "&check; Update Employee"}
          </button>
        )}
      </div>
    </div>
  );
}
