"use client";

import { useEffect, useState } from "react";
import { X, UserCheck } from "lucide-react";
import type { Lead } from "@/types/lead/lead";
import {
  assignLead,
  getLeadAssignees,
  type LeadAssignee,
} from "@/lib/api/leads/leadApi";

interface LeadAssignmentDialogProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadAssignmentDialog({
  lead,
  open,
  onClose,
  onSuccess,
}: LeadAssignmentDialogProps) {
  const [employees, setEmployees] = useState<LeadAssignee[]>([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setError("");
    setReason("");
    setAssignedTo(lead?.assigned_to ? String(lead.assigned_to) : "");

    async function loadEmployees() {
      try {
        setLoadingEmployees(true);

        const response = await getLeadAssignees();

        const users =
          response.data?.users ||
          response.data?.data ||
          [];

        setEmployees(users);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Unable to load employees."
        );
      } finally {
        setLoadingEmployees(false);
      }
    }

    loadEmployees();
  }, [open, lead]);

  if (!open || !lead) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!assignedTo) {
      setError("Please select an employee.");
      return;
    }

    if (!reason.trim()) {
      setError("Reason is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (!lead) return;

      await assignLead(lead.id, {
        assigned_to: Number(assignedTo),
        reason: reason.trim(),
        assignment_type: lead.assigned_to
          ? "manager_reassign"
          : "manual",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to assign lead."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overlay">
      <div className="dialog">
        <div className="header">
          <div>
            <div className="eyebrow">
              <UserCheck size={14} />
              LEAD ASSIGNMENT
            </div>

            <h3>
              {lead.assigned_to
                ? "Reassign Lead"
                : "Assign Lead"}
            </h3>

            <p>{lead.name}</p>
          </div>

          <button
            type="button"
            className="close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Employee
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={loadingEmployees || saving}
            >
              <option value="">
                {loadingEmployees
                  ? "Loading employees..."
                  : "Select employee"}
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                  {employee.email
                    ? ` Ã¢â‚¬â€ ${employee.email}`
                    : ""}
                </option>
              ))}
            </select>
          </label>

          <label>
            Reason
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for assignment..."
              rows={4}
              disabled={saving}
            />
          </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <div className="footer">
            <button
              type="button"
              className="cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : lead.assigned_to
                ? "Reassign Lead"
                : "Assign Lead"}
            </button>
          </div>
        </form>

        <style jsx>{`
          .overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: grid;
            place-items: center;
            padding: 20px;
            background: rgba(15, 23, 42, 0.42);
          }

          .dialog {
            width: min(520px, 100%);
            background: white;
            border-radius: 14px;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
            overflow: hidden;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding: 20px;
            border-bottom: 1px solid #e5edf4;
          }

          .eyebrow {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #1769aa;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.08em;
          }

          h3 {
            margin: 7px 0 3px;
            color: #102a43;
            font-size: 20px;
          }

          p {
            margin: 0;
            color: #627d98;
            font-size: 12px;
          }

          .close {
            width: 34px;
            height: 34px;
            border: 1px solid #dce6ef;
            border-radius: 8px;
            background: white;
            color: #627d98;
            cursor: pointer;
          }

          form {
            padding: 20px;
          }

          label {
            display: block;
            margin-bottom: 16px;
            color: #334e68;
            font-size: 12px;
            font-weight: 700;
          }

          select,
          textarea {
            width: 100%;
            margin-top: 7px;
            box-sizing: border-box;
            border: 1px solid #d8e2ec;
            border-radius: 8px;
            padding: 10px 11px;
            background: white;
            color: #243b53;
            font-size: 12px;
            outline: none;
          }

          textarea {
            resize: vertical;
            min-height: 90px;
          }

          select:focus,
          textarea:focus {
            border-color: #6fa7d0;
            box-shadow: 0 0 0 3px rgba(23, 105, 170, 0.08);
          }

          .error {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 8px;
            background: #fff4f4;
            border: 1px solid #f0caca;
            color: #b42318;
            font-size: 11px;
          }

          .footer {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }

          .cancel,
          .save {
            height: 38px;
            padding: 0 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          .cancel {
            border: 1px solid #d8e2ec;
            background: white;
            color: #486581;
          }

          .save {
            border: 1px solid #1769aa;
            background: #1769aa;
            color: white;
          }

          .save:disabled,
          .cancel:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}


