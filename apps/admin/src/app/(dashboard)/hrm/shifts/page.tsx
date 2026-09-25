"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock3,
  Edit,
  Plus,
  Power,
  Search,
  Trash2,
} from "lucide-react";

import {
  deleteShift,
  getShifts,
  toggleShift,
  Shift,
} from "@/lib/api/hrm/shiftApi";

export default function ShiftsPage() {
  const router = useRouter();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  async function loadShifts() {
    try {
      setLoading(true);
      setError("");

      const result = await getShifts();

      setShifts(Array.isArray(result.data) ? result.data : []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load shifts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShifts();
  }, []);

  async function handleToggle(id: number) {
    try {
      await toggleShift(id);
      await loadShifts();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update shift status."
      );
    }
  }

  async function handleDelete(id: number, name: string) {
    const confirmed = window.confirm(
      `Delete shift "${name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteShift(id);
      await loadShifts();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete shift."
      );
    }
  }

  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.name.toLowerCase().includes(search.toLowerCase()) ||
      shift.code.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeFilter === "all" ||
      (activeFilter === "active" && shift.is_active) ||
      (activeFilter === "inactive" && !shift.is_active);

    return matchesSearch && matchesStatus;
  });

  function formatTime(value: string) {
    if (!value) return "-";

    const parts = value.split(":");

    if (parts.length < 2) return value;

    const hour = Number(parts[0]);
    const minute = parts[1];

    if (Number.isNaN(hour)) return value;

    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 size={22} />
            <h1 className="text-2xl font-semibold">Shifts</h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage employee work shifts and timings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/hrm/shifts/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={16} />
          Create Shift
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-white">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shifts..."
              className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex rounded-lg border p-1">
            {(["all", "active", "inactive"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-md px-3 py-1.5 text-sm capitalize ${
                  activeFilter === filter
                    ? "bg-gray-100 font-medium"
                    : "text-gray-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading shifts...
          </div>
        ) : filteredShifts.length === 0 ? (
          <div className="p-10 text-center">
            <Clock3 className="mx-auto mb-3 text-gray-400" size={28} />

            <p className="font-medium text-gray-700">
              No shifts found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Create your first employee shift to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Shift</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Timing</th>
                  <th className="px-4 py-3 font-medium">Break</th>
                  <th className="px-4 py-3 font-medium">Grace</th>
                  <th className="px-4 py-3 font-medium">OT</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {shift.name}
                      </div>

                      {shift.description && (
                        <div className="mt-1 max-w-xs truncate text-xs text-gray-500">
                          {shift.description}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 font-mono text-xs">
                      {shift.code}
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        {formatTime(shift.start_time)} –{" "}
                        {formatTime(shift.end_time)}
                      </div>

                      {shift.cross_midnight && (
                        <span className="text-xs text-orange-600">
                          Cross midnight
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {shift.break_duration_minutes} min
                    </td>

                    <td className="px-4 py-4">
                      {shift.grace_period_minutes} min
                    </td>

                    <td className="px-4 py-4">
                      {shift.overtime_eligible ? (
                        <span className="text-green-700">
                          After{" "}
                          {shift.overtime_after_hours ?? "-"}h
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          shift.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {shift.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            router.push(
                              `/hrm/shifts/${shift.id}/edit`
                            )
                          }
                          className="rounded-lg border p-2 hover:bg-gray-100"
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          type="button"
                          title={
                            shift.is_active
                              ? "Deactivate"
                              : "Activate"
                          }
                          onClick={() =>
                            handleToggle(shift.id)
                          }
                          className="rounded-lg border p-2 hover:bg-gray-100"
                        >
                          <Power size={15} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() =>
                            handleDelete(
                              shift.id,
                              shift.name
                            )
                          }
                          className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
