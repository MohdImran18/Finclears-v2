"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import LeadList from "@/components/leads/LeadList";
import {
  deleteLead,
  getLeads,
} from "@/lib/api/leads/leadApi";

import type { Lead } from "@/types/lead/lead";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const response = await getLeads({
        per_page: 100,
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
      });

      setLeads(response.data?.data || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to load leads. Please check your login session."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [search, status, priority]);

  async function handleDelete(lead: Lead) {
    const confirmed = window.confirm(
      `Delete lead "${lead.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLead(lead.id);
      await loadLeads();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete lead."
      );
    }
  }

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter(
        (lead) => lead.status === "contacted"
      ).length,
      highPriority: leads.filter(
        (lead) => lead.priority === "high"
      ).length,
    };
  }, [leads]);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              <span style={brandMarkStyle}>L</span>
              CRM MANAGEMENT
            </div>

            <h1 style={titleStyle}>Leads</h1>

            <p style={subtitleStyle}>
              Manage, track and convert your sales leads.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/crm/leads/create")
            }
            style={primaryButtonStyle}
          >
            + Add New Lead
          </button>
        </header>

        <div style={statsGridStyle}>
          <StatCard
            label="Total Leads"
            value={stats.total}
          />

          <StatCard
            label="New Leads"
            value={stats.new}
          />

          <StatCard
            label="Contacted"
            value={stats.contacted}
          />

          <StatCard
            label="High Priority"
            value={stats.highPriority}
          />
        </div>

        <div style={filterCardStyle}>
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search name, phone, email or company..."
            style={inputStyle}
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            style={selectStyle}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
            style={selectStyle}
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {error && (
          <div style={errorStyle}>
            <span>{error}</span>

            <button
              type="button"
              onClick={loadLeads}
              style={retryStyle}
            >
              Retry
            </button>
          </div>
        )}

        <LeadList
          leads={leads}
          loading={loading}
          onEdit={(lead) =>
            router.push(`/crm/leads/${lead.id}/edit`)
          }
          onDelete={handleDelete}
        />

      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={statCardStyle}>
      <div>
        <div style={statLabelStyle}>{label}</div>
        <div style={statValueStyle}>{value}</div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f6f8fb",
  padding: "34px 24px 60px",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1350,
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 24,
  marginBottom: 26,
};

const eyebrowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#0f766e",
  fontSize: 12,
  fontWeight: 800,
  marginBottom: 10,
};

const brandMarkStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 9,
  display: "grid",
  placeItems: "center",
  background: "#0f766e",
  color: "#fff",
  fontWeight: 800,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 30,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
  fontSize: 14,
};

const primaryButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 18px",
  border: 0,
  borderRadius: 9,
  background: "#0f766e",
  color: "#fff",
  fontSize: 13,
  fontWeight: 750,
  cursor: "pointer",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: 14,
  marginBottom: 18,
};

const statCardStyle: React.CSSProperties = {
  minHeight: 86,
  display: "flex",
  alignItems: "center",
  padding: 17,
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 13,
};

const statLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  marginBottom: 4,
};

const statValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 23,
  fontWeight: 800,
};

const filterCardStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "1fr 180px 180px",
  gap: 10,
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 13,
  padding: 14,
  marginBottom: 18,
};

const inputStyle: React.CSSProperties = {
  height: 40,
  padding: "0 12px",
  border: "1px solid #dbe3ec",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  height: 40,
  padding: "0 10px",
  border: "1px solid #dbe3ec",
  borderRadius: 8,
  background: "#fff",
  fontSize: 13,
};

const errorStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  marginBottom: 18,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: 10,
  color: "#9a3412",
  fontSize: 13,
};

const retryStyle: React.CSSProperties = {
  border: "1px solid #fdba74",
  background: "#fff",
  color: "#c2410c",
  borderRadius: 7,
  padding: "7px 12px",
  cursor: "pointer",
  fontWeight: 700,
};
