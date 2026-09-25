"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import {
  createShift,
  ShiftPayload,
} from "@/lib/api/hrm/shiftApi";

export default function CreateShiftPage() {
  const router = useRouter();

  const [form, setForm] = useState<ShiftPayload>({
    name: "",
    code: "",
    start_time: "09:00",
    end_time: "18:00",
    break_duration_minutes: 60,
    grace_period_minutes: 15,
    minimum_working_hours: 8,
    overtime_eligible: false,
    overtime_after_hours: null,
    cross_midnight: false,
    is_active: true,
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ShiftPayload>(
    field: K,
    value: ShiftPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.name.trim()) {
        throw new Error("Shift name is required.");
      }

      if (!form.code.trim()) {
        throw new Error("Shift code is required.");
      }

      await createShift({
        ...form,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description?.trim() || null,
      });

      router.push("/hrm/shifts");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create shift."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.push("/hrm/shifts")}
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Shifts
        </button>

        <div className="flex items-center gap-2">
          <Clock3 size={22} />
          <h1 className="text-2xl font-semibold">Create Shift</h1>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Create a work shift with timing, break and overtime settings.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Shift Name *
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
                placeholder="e.g. General Shift"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Shift Code *
              </label>
              <input
                value={form.code}
                onChange={(e) =>
                  updateField(
                    "code",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. GENERAL"
                className="w-full rounded-lg border px-3 py-2.5 text-sm uppercase outline-none focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Start Time *
              </label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) =>
                  updateField("start_time", e.target.value)
                }
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                End Time *
              </label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) =>
                  updateField("end_time", e.target.value)
                }
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Working Hours</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={form.break_duration_minutes ?? 0}
                onChange={(e) =>
                  updateField(
                    "break_duration_minutes",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Grace Period (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={form.grace_period_minutes ?? 0}
                onChange={(e) =>
                  updateField(
                    "grace_period_minutes",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Minimum Working Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.minimum_working_hours ?? 0}
                onChange={(e) =>
                  updateField(
                    "minimum_working_hours",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Overtime & Status</h2>

          <div className="mt-5 space-y-5">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.overtime_eligible ?? false}
                onChange={(e) =>
                  updateField(
                    "overtime_eligible",
                    e.target.checked
                  )
                }
                className="h-4 w-4"
              />
              <span>Overtime eligible</span>
            </label>

            {form.overtime_eligible && (
              <div className="max-w-sm">
                <label className="mb-1.5 block text-sm font-medium">
                  Overtime After Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.overtime_after_hours ?? ""}
                  onChange={(e) =>
                    updateField(
                      "overtime_after_hours",
                      e.target.value === ""
                        ? null
                        : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 8"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                />
              </div>
            )}

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.cross_midnight ?? false}
                onChange={(e) =>
                  updateField(
                    "cross_midnight",
                    e.target.checked
                  )
                }
                className="h-4 w-4"
              />
              <span>Cross midnight shift</span>
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_active ?? true}
                onChange={(e) =>
                  updateField("is_active", e.target.checked)
                }
                className="h-4 w-4"
              />
              <span>Active</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Description</h2>

          <textarea
            value={form.description ?? ""}
            onChange={(e) =>
              updateField("description", e.target.value)
            }
            rows={4}
            placeholder="Optional description..."
            className="mt-4 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/hrm/shifts")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Shift"}
          </button>
        </div>
      </form>
    </div>
  );
}
