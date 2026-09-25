"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getEmployeeShiftAssignment,
  updateEmployeeShiftAssignment,
  deleteEmployeeShiftAssignment,
  type ShiftAssignment,
} from "@/lib/api/hrm/employeeShiftAssignmentApi";

export default function EditShiftAssignmentPage() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [assignment, setAssignment] =
    useState<ShiftAssignment | null>(null);

  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadAssignment = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getEmployeeShiftAssignment(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Shift assignment not found."
          );
        }

        const current = response.data;

        setAssignment(current);
        setEffectiveFrom(
          current.effective_from?.slice(0, 10) || ""
        );
        setEffectiveTo(
          current.effective_to?.slice(0, 10) || ""
        );
        setIsCurrent(Boolean(current.is_current));
        setNotes(current.notes || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load shift assignment."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) return;

    try {
      setSaving(true);
      setError("");

      const response =
        await updateEmployeeShiftAssignment(id, {
          effective_from: effectiveFrom,
          effective_to: effectiveTo || null,
          is_current: isCurrent,
          notes: notes.trim() || null,
        });

      if (!response.success) {
        throw new Error(
          response.message || "Failed to update assignment."
        );
      }

      router.push("/hrm/shift-assignments");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update shift assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this shift assignment?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response =
        await deleteEmployeeShiftAssignment(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to delete shift assignment."
        );
      }

      router.push("/hrm/shift-assignments");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete shift assignment."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <div className="pageHeader">
          <div>
            <h1>Edit Shift Assignment</h1>
            <p>Loading shift assignment...</p>
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Loader2 size={18} className="animate-spin" />
            Loading...
          </div>
        </div>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main className="page">
        <div className="pageHeader">
          <div>
            <h1>Shift Assignment</h1>
            <p>Unable to load this assignment.</p>
          </div>
        </div>

        <div className="card">
          <p style={{ marginBottom: 16 }}>
            {error || "Shift assignment not found."}
          </p>

          <button
            type="button"
            className="btn secondary"
            onClick={() =>
              router.push("/hrm/shift-assignments")
            }
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </main>
    );
  }

  const employee =
    assignment.employeeProfile ||
    assignment.employee_profile;

  const employeeName =
    employee?.user?.name ||
    employee?.employee_code ||
    `Employee #${assignment.employee_profile_id}`;

  const shiftName =
    assignment.shift?.name ||
    `Shift #${assignment.shift_id}`;

  return (
    <main className="page">
      <div className="pageHeader">
        <div>
          <h1>Edit Shift Assignment</h1>
          <p>
            Update the employee's assigned shift and effective
            dates.
          </p>
        </div>

        <button
          type="button"
          className="btn secondary"
          onClick={() =>
            router.push("/hrm/shift-assignments")
          }
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {error && (
        <div
          className="card"
          style={{
            marginBottom: 16,
            borderColor: "#ef4444",
          }}
        >
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            <div>
              <label>Employee</label>
              <input
                value={employeeName}
                disabled
              />
            </div>

            <div>
              <label>Shift</label>
              <input
                value={shiftName}
                disabled
              />
            </div>

            <div>
              <label htmlFor="effective_from">
                Effective From
              </label>
              <input
                id="effective_from"
                type="date"
                value={effectiveFrom}
                onChange={(event) =>
                  setEffectiveFrom(event.target.value)
                }
                required
              />
            </div>

            <div>
              <label htmlFor="effective_to">
                Effective To
              </label>
              <input
                id="effective_to"
                type="date"
                value={effectiveTo}
                onChange={(event) =>
                  setEffectiveTo(event.target.value)
                }
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(event) =>
                  setIsCurrent(event.target.checked)
                }
              />
              <span>Mark as current shift</span>
            </label>
          </div>

          <div style={{ marginTop: 20 }}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              placeholder="Add any notes about this assignment..."
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 20,
          }}
        >
          <button
            type="button"
            className="btn danger"
            onClick={handleDelete}
            disabled={deleting || saving}
          >
            {deleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            {deleting ? "Deleting..." : "Delete"}
          </button>

          <button
            type="submit"
            className="btn primary"
            disabled={saving || deleting}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
