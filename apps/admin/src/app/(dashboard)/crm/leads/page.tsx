"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  AlertCircle,
  X,
} from "lucide-react";

import LeadList from "@/components/leads/LeadList";
import LeadAssignmentDialog from "@/components/leads/LeadAssignmentDialog";
import { deleteLead, getLeadPool, getLeads } from "@/lib/api/leads/leadApi";
import type { Lead } from "@/types/lead/lead";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [poolMode, setPoolMode] = useState(false);
  const [assignmentLead, setAssignmentLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const response = poolMode
        ? await getLeadPool({
            per_page: 100,
            status: status || undefined,
            priority: priority || undefined,
          })
        : await getLeads({
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
  }, [search, status, priority, poolMode]);

  async function handleDelete(lead: Lead) {
    const confirmed = window.confirm(
      `Delete lead "${lead.name || "Unnamed Lead"}"?`
    );

    if (!confirmed) return;

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

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter(
        (lead) => lead.status === "contacted"
      ).length,
      highPriority: leads.filter(
        (lead) => lead.priority === "high"
      ).length,
    }),
    [leads]
  );

  function clearFilters() {
    setSearch("");
    setStatus("");
    setPriority("");
  }

  const hasFilters = Boolean(search || status || priority);

  function handleAssignmentSuccess() {
    setAssignmentLead(null);
    loadLeads();
  }


  return (
    <main className="leadsPage">
      <div className="leadsContainer">

        <header className="leadsHeader">
          <div>
            <div className="leadsEyebrow">
              <span className="eyebrowIcon">
                <Users size={14} />
              </span>
              CRM / LEADS
            </div>

            <h1>Leads</h1>

            <p>
              Manage, track and convert your sales leads from one place.
            </p>
          </div>

          <div className="headerActions">
            <button
              type="button"
              className="secondaryButton"
              onClick={loadLeads}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? "spin" : ""}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              className={poolMode ? "poolButton active" : "poolButton"}
              onClick={() => setPoolMode((value) => !value)}
            >
              <UserCheck size={16} />
              {poolMode ? "All Leads" : "Lead Pool"}
            </button>

            <button
              type="button"
              className="primaryButton"
              onClick={() =>
                router.push("/crm/leads/create")
              }
            >
              <UserPlus size={16} />
              Add Lead
            </button>
          </div>
        </header>

        <section className="statsGrid">

          <StatCard
            icon={<Users size={18} />}
            label="Total Leads"
            value={stats.total}
            description="All CRM leads"
          />

          <StatCard
            icon={<TrendingUp size={18} />}
            label="New Leads"
            value={stats.new}
            description="Recently received"
          />

          <StatCard
            icon={<UserCheck size={18} />}
            label="Contacted"
            value={stats.contacted}
            description="Leads contacted"
          />

          <StatCard
            icon={<AlertCircle size={18} />}
            label="High Priority"
            value={stats.highPriority}
            description="Needs attention"
          />

        </section>

        <section className="filterPanel">

          <div className="searchBox">
            <Search size={17} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, phone, email or company..."
            />

            {search && (
              <button
                type="button"
                className="clearSearch"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="filterSelect">
            <Filter size={15} />

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="filterSelect">
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="clearFilters"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}

        </section>

        {error && (
          <div className="errorBanner">
            <div>
              <strong>Unable to load leads</strong>
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadLeads}
            >
              Retry
            </button>
          </div>
        )}

        <section className="tableCard">

          <div className="tableCardHeader">
            <div>
              <h2>Lead Management</h2>
              <p>
                {loading
                  ? "Loading CRM data..."
                  : `${leads.length} lead${
                      leads.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>

            <button
              type="button"
              className="viewAllButton"
              onClick={loadLeads}
            >
              Refresh data
              <ArrowUpRight size={14} />
            </button>
          </div>

          <LeadList
            leads={leads}
            loading={loading}
            onEdit={(lead) =>
              router.push(`/crm/leads/${lead.id}/edit`)
            }
            onDelete={handleDelete}
            onAssign={(lead) => setAssignmentLead(lead)}
          />

        </section>

      </div>

      <style jsx>{`
        .leadsPage {
          min-height: 100%;
          width: 100%;
          background: #f6f9fc;
          color: #102a43;
        }

        .leadsContainer {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding: 30px 30px 40px;
          box-sizing: border-box;
        }

        .leadsHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 24px;
        }

        .leadsEyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1769aa;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .1em;
          margin-bottom: 9px;
        }

        .eyebrowIcon {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #e8f2fb;
          color: #1769aa;
        }

        .leadsHeader h1 {
          margin: 0;
          color: #102a43;
          font-size: 30px;
          line-height: 1.15;
          letter-spacing: -.025em;
          font-weight: 800;
        }

        .leadsHeader p {
          margin: 7px 0 0;
          color: #627d98;
          font-size: 13px;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .primaryButton,
        .secondaryButton {
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 15px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: .18s ease;
        }

        .primaryButton {
          border: 1px solid #1769aa;
          background: #1769aa;
          color: white;
          box-shadow: 0 4px 10px rgba(23, 105, 170, .16);
        }

        .primaryButton:hover {
          background: #125b93;
          transform: translateY(-1px);
        }

        .secondaryButton {
          border: 1px solid #d8e2ec;
          background: white;
          color: #486581;
        }

        .secondaryButton:hover {
          border-color: #a9c2d8;
          background: #f8fbfd;
        }

        .poolButton {
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 15px;
          border-radius: 8px;
          border: 1px solid #d6e3ee;
          background: white;
          color: #1769aa;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        .poolButton:hover {
          background: #edf6fc;
          border-color: #a9c7df;
        }

        .poolButton.active {
          background: #e8f2fb;
          border-color: #1769aa;
        }

        .secondaryButton:disabled {
          cursor: not-allowed;
          opacity: .65;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }

        .statCard {
          min-height: 94px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 17px;
          background: white;
          border: 1px solid #dce6ef;
          border-radius: 11px;
          box-sizing: border-box;
          transition: .18s ease;
        }

        .statCard:hover {
          border-color: #b9d2e6;
          box-shadow: 0 7px 20px rgba(16, 42, 67, .06);
          transform: translateY(-1px);
        }

        .statIcon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #eaf3fb;
          color: #1769aa;
        }

        .statLabel {
          color: #627d98;
          font-size: 11px;
          font-weight: 650;
          margin-bottom: 3px;
        }

        .statValue {
          color: #102a43;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
        }

        .statDescription {
          margin-top: 3px;
          color: #9fb3c8;
          font-size: 10px;
        }

        .filterPanel {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px;
          margin-bottom: 16px;
          background: white;
          border: 1px solid #dce6ef;
          border-radius: 11px;
          box-sizing: border-box;
        }

        .searchBox {
          height: 39px;
          flex: 1;
          min-width: 220px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 11px;
          border: 1px solid #d8e2ec;
          border-radius: 8px;
          background: #fff;
          color: #829ab1;
          box-sizing: border-box;
        }

        .searchBox:focus-within {
          border-color: #6fa7d0;
          box-shadow: 0 0 0 3px rgba(23, 105, 170, .08);
        }

        .searchBox input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #243b53;
          font-size: 12px;
        }

        .searchBox input::placeholder {
          color: #9fb3c8;
        }

        .clearSearch {
          border: 0;
          background: transparent;
          color: #829ab1;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .filterSelect {
          height: 39px;
          min-width: 155px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 10px;
          border: 1px solid #d8e2ec;
          border-radius: 8px;
          background: white;
          color: #829ab1;
          box-sizing: border-box;
        }

        .filterSelect select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #486581;
          font-size: 12px;
          cursor: pointer;
        }

        .clearFilters {
          height: 34px;
          padding: 0 10px;
          border: 0;
          background: transparent;
          color: #1769aa;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .errorBanner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 12px 14px;
          margin-bottom: 16px;
          background: #fff8f5;
          border: 1px solid #f3c8b8;
          border-radius: 10px;
          color: #9c2c13;
        }

        .errorBanner div {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 11px;
        }

        .errorBanner button {
          height: 31px;
          padding: 0 11px;
          border: 1px solid #e7a994;
          border-radius: 7px;
          background: white;
          color: #a83b21;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .tableCard {
          overflow: hidden;
          background: white;
          border: 1px solid #dce6ef;
          border-radius: 11px;
          box-shadow: 0 2px 8px rgba(16, 42, 67, .025);
        }

        .tableCardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 17px 18px;
          border-bottom: 1px solid #e7eef5;
        }

        .tableCardHeader h2 {
          margin: 0;
          color: #243b53;
          font-size: 14px;
          font-weight: 800;
        }

        .tableCardHeader p {
          margin: 4px 0 0;
          color: #829ab1;
          font-size: 11px;
        }

        .viewAllButton {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 0;
          background: transparent;
          color: #1769aa;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 1050px) {
          .statsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filterPanel {
            flex-wrap: wrap;
          }

          .searchBox {
            flex-basis: 100%;
          }
        }

        @media (max-width: 700px) {
          .leadsContainer {
            padding: 20px 14px 30px;
          }

          .leadsHeader {
            flex-direction: column;
          }

          .headerActions {
            width: 100%;
          }

          .primaryButton,
          .secondaryButton {
            flex: 1;
          }

          .statsGrid {
            grid-template-columns: 1fr;
          }

          .filterPanel {
            align-items: stretch;
            flex-direction: column;
          }

          .searchBox,
          .filterSelect {
            width: 100%;
            min-width: 0;
          }

          .clearFilters {
            align-self: flex-start;
          }
        }
      `}</style>

        <LeadAssignmentDialog
          lead={assignmentLead}
          open={Boolean(assignmentLead)}
          onClose={() => setAssignmentLead(null)}
          onSuccess={handleAssignmentSuccess}
        />

    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="statCard">
      <div className="statIcon">{icon}</div>

      <div>
        <div className="statLabel">{label}</div>
        <div className="statValue">{value}</div>
        <div className="statDescription">{description}</div>
      </div>
    </div>
  );
}
