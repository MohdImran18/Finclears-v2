"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  MessageSquare,
  Phone,
  CalendarClock,
  Send,
  CheckCircle2,
} from "lucide-react";

import {
  addLeadCall,
  addLeadComment,
  addLeadFollowup,
  getLeadTimeline,
  updateLeadFollowup,
} from "@/lib/api/leads/leadApi";

interface TimelineItem {
  id: number;
  category: string;
  type: string;
  subject?: string | null;
  description?: string | null;
  occurred_at?: string | null;
  status?: string | null;
  outcome?: string | null;
  follow_up_at?: string | null;
  completed_at?: string | null;
  duration_seconds?: number | null;
  user?: {
    id: number;
    name: string;
    email?: string | null;
  } | null;
  from_user?: {
    id: number;
    name: string;
  } | null;
  to_user?: {
    id: number;
    name: string;
  } | null;
  reason?: string | null;
}

export default function LeadCommunicationPanel({
  leadId,
}: {
  leadId: number;
}) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [comment, setComment] = useState("");

  const [callType, setCallType] = useState("outgoing");
  const [callStartedAt, setCallStartedAt] = useState("");
  const [callOutcome, setCallOutcome] = useState("");
  const [callDiscussion, setCallDiscussion] = useState("");
  const [callNextAction, setCallNextAction] = useState("");

  const [followupAt, setFollowupAt] = useState("");
  const [followupType, setFollowupType] = useState("call");
  const [followupSubject, setFollowupSubject] = useState("");
  const [followupNotes, setFollowupNotes] = useState("");

  async function loadTimeline() {
    try {
      setLoading(true);
      setError("");

      const response = await getLeadTimeline(leadId);

      setTimeline(
        response?.data?.timeline || []
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to load lead communication."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTimeline();
  }, [leadId]);

  async function submitComment() {
    if (!comment.trim()) return;

    try {
      setSaving(true);
      await addLeadComment(
        leadId,
        comment.trim()
      );
      setComment("");
      await loadTimeline();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to add comment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitCall() {
    if (!callStartedAt || !callDiscussion.trim()) {
      setError(
        "Call start time and discussion are required."
      );
      return;
    }

    try {
      setSaving(true);

      await addLeadCall(leadId, {
        call_type: callType as
          | "incoming"
          | "outgoing"
          | "missed"
          | "callback"
          | "whatsapp"
          | "other",
        started_at: callStartedAt,
        outcome: callOutcome.trim() || null,
        discussion: callDiscussion.trim(),
        next_action: callNextAction.trim() || null,
      });

      setCallStartedAt("");
      setCallOutcome("");
      setCallDiscussion("");
      setCallNextAction("");

      await loadTimeline();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to log call."
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitFollowup() {
    if (!followupAt || !followupSubject.trim()) {
      setError(
        "Follow-up date and subject are required."
      );
      return;
    }

    try {
      setSaving(true);

      await addLeadFollowup(leadId, {
        follow_up_at: followupAt,
        type: followupType as
          | "call"
          | "email"
          | "whatsapp"
          | "meeting"
          | "reminder"
          | "other",
        subject: followupSubject.trim(),
        notes: followupNotes.trim() || null,
        status: "pending",
      });

      setFollowupAt("");
      setFollowupSubject("");
      setFollowupNotes("");

      await loadTimeline();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to create follow-up."
      );
    } finally {
      setSaving(false);
    }
  }

  async function completeFollowup(item: TimelineItem) {
    if (item.category !== "followup") return;

    try {
      setSaving(true);

      await updateLeadFollowup(
        leadId,
        item.id,
        {
          status: "completed",
          completed_at: new Date().toISOString(),
        }
      );

      await loadTimeline();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to complete follow-up."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="communication">
      <div className="sectionHeader">
        <div>
          <div className="eyebrow">
            CRM COMMUNICATION
          </div>
          <h2>Timeline & Activity</h2>
          <p>
            Keep comments, calls, follow-ups and assignment
            activity in one place.
          </p>
        </div>
      </div>

      {error && (
        <div className="errorBox">
          {error}
        </div>
      )}

      <div className="actionGrid">
        <div className="actionCard">
          <div className="actionTitle">
            <MessageSquare size={16} />
            Add Comment
          </div>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write an internal comment..."
            rows={4}
          />

          <button
            type="button"
            onClick={submitComment}
            disabled={saving || !comment.trim()}
          >
            <Send size={14} />
            Add Comment
          </button>
        </div>

        <div className="actionCard">
          <div className="actionTitle">
            <Phone size={16} />
            Log Call
          </div>

          <div className="twoCol">
            <input
              type="datetime-local"
              value={callStartedAt}
              onChange={(e) =>
                setCallStartedAt(e.target.value)
              }
            />

            <select
              value={callType}
              onChange={(e) =>
                setCallType(e.target.value)
              }
            >
              <option value="outgoing">Outgoing</option>
              <option value="incoming">Incoming</option>
              <option value="missed">Missed</option>
              <option value="callback">Callback</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            value={callOutcome}
            onChange={(e) =>
              setCallOutcome(e.target.value)
            }
            placeholder="Outcome"
          />

          <textarea
            value={callDiscussion}
            onChange={(e) =>
              setCallDiscussion(e.target.value)
            }
            placeholder="What was discussed?"
            rows={3}
          />

          <input
            value={callNextAction}
            onChange={(e) =>
              setCallNextAction(e.target.value)
            }
            placeholder="Next action"
          />

          <button
            type="button"
            onClick={submitCall}
            disabled={saving}
          >
            <Phone size={14} />
            Save Call
          </button>
        </div>

        <div className="actionCard">
          <div className="actionTitle">
            <CalendarClock size={16} />
            Add Follow-up
          </div>

          <input
            type="datetime-local"
            value={followupAt}
            onChange={(e) =>
              setFollowupAt(e.target.value)
            }
          />

          <select
            value={followupType}
            onChange={(e) =>
              setFollowupType(e.target.value)
            }
          >
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="meeting">Meeting</option>
            <option value="reminder">Reminder</option>
            <option value="other">Other</option>
          </select>

          <input
            value={followupSubject}
            onChange={(e) =>
              setFollowupSubject(e.target.value)
            }
            placeholder="Follow-up subject"
          />

          <textarea
            value={followupNotes}
            onChange={(e) =>
              setFollowupNotes(e.target.value)
            }
            placeholder="Notes"
            rows={3}
          />

          <button
            type="button"
            onClick={submitFollowup}
            disabled={saving}
          >
            <CalendarClock size={14} />
            Save Follow-up
          </button>
        </div>
      </div>

      <div className="timelineCard">
        <div className="timelineHeader">
          <div className="actionTitle">
            <Activity size={16} />
            Activity Timeline
          </div>

          <button
            type="button"
            onClick={loadTimeline}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty">
            Loading timeline...
          </div>
        ) : timeline.length === 0 ? (
          <div className="empty">
            No communication activity yet.
          </div>
        ) : (
          <div className="timeline">
            {timeline.map((item) => (
              <div
                className="timelineItem"
                key={`${item.category}-${item.id}`}
              >
                <div className="dot" />

                <div className="content">
                  <div className="itemTop">
                    <strong>
                      {item.subject ||
                        item.type ||
                        item.category}
                    </strong>

                    <span>
                      {item.occurred_at
                        ? new Date(
                            item.occurred_at
                          ).toLocaleString()
                        : ""}
                    </span>
                  </div>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  {item.outcome && (
                    <div className="meta">
                      Outcome: {item.outcome}
                    </div>
                  )}

                  {item.status && (
                    <div className="meta">
                      Status: {item.status}
                    </div>
                  )}

                  {item.category === "assignment" &&
                    item.from_user && (
                      <div className="meta">
                        {item.from_user.name} →{" "}
                        {item.to_user?.name ||
                          "Unassigned"}
                      </div>
                    )}

                  {item.category === "assignment" &&
                    item.reason && (
                      <div className="meta">
                        Reason: {item.reason}
                      </div>
                    )}

                  {item.category === "followup" &&
                    item.status === "pending" && (
                      <button
                        type="button"
                        className="completeButton"
                        disabled={saving}
                        onClick={() =>
                          completeFollowup(item)
                        }
                      >
                        <CheckCircle2 size={13} />
                        Mark Completed
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .communication {
          margin-top: 24px;
        }

        .sectionHeader {
          margin-bottom: 16px;
        }

        .eyebrow {
          color: #2878b8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;
        }

        h2 {
          margin: 5px 0;
          color: #102a43;
          font-size: 21px;
        }

        .sectionHeader p {
          margin: 0;
          color: #627d98;
          font-size: 12px;
        }

        .errorBox {
          margin-bottom: 14px;
          padding: 11px 13px;
          border: 1px solid #f0caca;
          border-radius: 8px;
          background: #fff6f6;
          color: #b42318;
          font-size: 12px;
        }

        .actionGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .actionCard,
        .timelineCard {
          border: 1px solid #dbe6ef;
          border-radius: 12px;
          background: #fff;
          padding: 16px;
        }

        .actionCard {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .actionTitle {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #173b56;
          font-size: 12px;
          font-weight: 800;
        }

        input,
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d8e3ec;
          border-radius: 8px;
          padding: 9px 10px;
          font-size: 12px;
          color: #243b53;
          background: #fff;
        }

        textarea {
          resize: vertical;
        }

        .twoCol {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .actionCard button,
        .timelineHeader button,
        .completeButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 35px;
          border: 0;
          border-radius: 7px;
          background: #1769aa;
          color: #fff;
          padding: 0 12px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .timelineCard {
          margin-top: 14px;
        }

        .timelineHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 13px;
          border-bottom: 1px solid #e8eef4;
        }

        .timelineHeader button {
          min-height: 30px;
          background: #edf5fb;
          color: #1769aa;
          border: 1px solid #cfe0ed;
        }

        .timeline {
          padding-top: 12px;
        }

        .timelineItem {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 10px;
          position: relative;
          padding-bottom: 16px;
        }

        .timelineItem:not(:last-child)::before {
          content: "";
          position: absolute;
          left: 7px;
          top: 16px;
          bottom: 0;
          width: 1px;
          background: #dfe8ef;
        }

        .dot {
          width: 14px;
          height: 14px;
          margin-top: 3px;
          border-radius: 50%;
          border: 3px solid #dcebf6;
          background: #1769aa;
          box-sizing: border-box;
          z-index: 1;
        }

        .itemTop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .itemTop strong {
          color: #243b53;
          font-size: 12px;
        }

        .itemTop span {
          color: #829ab1;
          font-size: 10px;
          white-space: nowrap;
        }

        .content p {
          margin: 5px 0 4px;
          color: #486581;
          font-size: 11px;
          line-height: 1.55;
        }

        .meta {
          color: #829ab1;
          font-size: 10px;
          margin-top: 3px;
        }

        .completeButton {
          margin-top: 7px;
          min-height: 28px;
          background: #edf8f1;
          color: #26734d;
          border: 1px solid #cce8d6;
        }

        .empty {
          padding: 30px;
          text-align: center;
          color: #829ab1;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .actionGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}