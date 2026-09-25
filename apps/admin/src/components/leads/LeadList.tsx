"use client";

import {
  Edit3,
  Trash2,
  Mail,
  Phone,
  CalendarDays,
  IndianRupee,
  UserCheck,
} from "lucide-react";

import type { Lead } from "@/types/lead/lead";

interface LeadListProps {
  leads: Lead[];
  loading?: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAssign: (lead: Lead) => void;
}

export default function LeadList({
  leads,
  loading,
  onEdit,
  onDelete,
  onAssign,
}: LeadListProps) {

  if (loading) {
    return (
      <div className="stateBox">
        <div className="loader" />
        <strong>Loading leads...</strong>
        <span>Fetching latest CRM data</span>

        <style jsx>{`
          .stateBox {
            min-height: 260px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 7px;
            color: #627d98;
            font-size: 11px;
          }

          .stateBox strong {
            color: #334e68;
            font-size: 13px;
          }

          .loader {
            width: 27px;
            height: 27px;
            margin-bottom: 5px;
            border: 3px solid #dbeaf5;
            border-top-color: #1769aa;
            border-radius: 50%;
            animation: spin .8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="stateBox">
        <div className="emptyIcon">+</div>
        <strong>No leads found</strong>
        <span>Try changing your search or filters.</span>

        <style jsx>{`
          .stateBox {
            min-height: 250px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            color: #829ab1;
            font-size: 11px;
          }

          .stateBox strong {
            color: #334e68;
            font-size: 13px;
          }

          .emptyIcon {
            width: 38px;
            height: 38px;
            display: grid;
            place-items: center;
            margin-bottom: 3px;
            border-radius: 10px;
            background: #eaf3fb;
            color: #1769aa;
            font-size: 21px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Contact</th>
            <th>Source</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Value</th>
            <th>Follow-up</th>
            <th className="actionHeader">Action</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>

              <td>
                <div className="leadCell">
                  <div className="avatar">
                    {(lead.name || "L")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="leadInfo">
                    <strong>
                      {lead.name || "Unnamed Lead"}
                    </strong>

                    {lead.company_name && (
                      <span>{lead.company_name}</span>
                    )}
                  </div>
                </div>
              </td>

              <td>
                <div className="contactCell">
                  {lead.phone && (
                    <span>
                      <Phone size={12} />
                      {lead.phone}
                    </span>
                  )}

                  {lead.email && (
                    <span>
                      <Mail size={12} />
                      {lead.email}
                    </span>
                  )}

                  {!lead.phone && !lead.email && (
                    <span className="muted">No contact</span>
                  )}
                </div>
              </td>

              <td>
                <span className="source">
                  {lead.source?.name || "Direct"}
                </span>
              </td>

              <td>
                <StatusBadge status={lead.status} />
              </td>

              <td>
                <PriorityBadge priority={lead.priority} />
              </td>

              <td>
                <div className="valueCell">
                  {lead.estimated_value ? (
                    <>
                      <IndianRupee size={12} />
                      {Number(
                        lead.estimated_value
                      ).toLocaleString("en-IN")}
                    </>
                  ) : (
                    "—"
                  )}
                </div>
              </td>

              <td>
                <div className="followUp">
                  <CalendarDays size={12} />

                  {lead.next_follow_up_at
                    ? new Date(
                        lead.next_follow_up_at
                      ).toLocaleDateString("en-IN")
                    : "—"}
                </div>
              </td>

              <td>
                <div className="actions">

                  <button
                    type="button"
                    className="assignButton"
                    onClick={() => onAssign(lead)}
                    title={lead.assigned_to ? "Reassign lead" : "Assign lead"}
                  >
                    <UserCheck size={14} />
                  </button>

                  <button
                    type="button"
                    className="editButton"
                    onClick={() => onEdit(lead)}
                    title="Edit lead"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => onDelete(lead)}
                    title="Delete lead"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .tableWrap {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
        }

        th {
          height: 43px;
          padding: 0 14px;
          text-align: left;
          background: #f8fafc;
          border-bottom: 1px solid #e3ebf3;
          color: #829ab1;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .045em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        td {
          padding: 13px 14px;
          border-bottom: 1px solid #edf2f7;
          color: #486581;
          font-size: 11px;
          vertical-align: middle;
          white-space: nowrap;
        }

        tbody tr {
          transition: background .15s ease;
        }

        tbody tr:hover {
          background: #f8fbfd;
        }

        tbody tr:last-child td {
          border-bottom: 0;
        }

        .actionHeader {
          text-align: right;
        }

        .leadCell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 185px;
        }

        .avatar {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #e8f2fb;
          color: #1769aa;
          font-size: 12px;
          font-weight: 800;
        }

        .leadInfo {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .leadInfo strong {
          color: #243b53;
          font-size: 12px;
          font-weight: 750;
        }

        .leadInfo span {
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #9fb3c8;
          font-size: 10px;
        }

        .contactCell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contactCell span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #627d98;
        }

        .muted {
          color: #a5b5c5 !important;
        }

        .source {
          color: #627d98;
        }

        .valueCell,
        .followUp {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #486581;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
        }

        .editButton,
        .deleteButton {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          cursor: pointer;
          transition: .15s ease;
        }

        .assignButton {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid #d6e3ee;
          border-radius: 7px;
          background: white;
          color: #1769aa;
          cursor: pointer;
          transition: .15s ease;
        }

        .assignButton:hover {
          background: #edf6fc;
          border-color: #a9c7df;
        }

        .editButton {
          border: 1px solid #d6e3ee;
          background: white;
          color: #1769aa;
        }

        .editButton:hover {
          background: #edf6fc;
          border-color: #a9c7df;
        }

        .deleteButton {
          border: 1px solid #f1d1d1;
          background: white;
          color: #c24141;
        }

        .deleteButton:hover {
          background: #fff5f5;
          border-color: #e8aaaa;
        }
      `}</style>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = (status || "new").toLowerCase();

  const config: Record<
    string,
    { label: string; bg: string; color: string }
  > = {
    new: {
      label: "New",
      bg: "#e8f2fb",
      color: "#1769aa",
    },
    contacted: {
      label: "Contacted",
      bg: "#e8f0ff",
      color: "#365fba",
    },
    qualified: {
      label: "Qualified",
      bg: "#edf7f0",
      color: "#237a4b",
    },
    converted: {
      label: "Converted",
      bg: "#e5f7ed",
      color: "#167044",
    },
    lost: {
      label: "Lost",
      bg: "#fff0f0",
      color: "#b42318",
    },
  };

  const item = config[normalized] || {
    label: normalized || "New",
    bg: "#f1f5f9",
    color: "#627d98",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontSize: 10,
        fontWeight: 800,
      }}
    >
      {item.label}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const normalized = (priority || "medium").toLowerCase();

  const config: Record<
    string,
    { label: string; bg: string; color: string }
  > = {
    high: {
      label: "High",
      bg: "#fff0f0",
      color: "#b42318",
    },
    medium: {
      label: "Medium",
      bg: "#fff7e6",
      color: "#9a6700",
    },
    low: {
      label: "Low",
      bg: "#f1f5f9",
      color: "#627d98",
    },
  };

  const item = config[normalized] || config.medium;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontSize: 10,
        fontWeight: 800,
      }}
    >
      {item.label}
    </span>
  );
}
