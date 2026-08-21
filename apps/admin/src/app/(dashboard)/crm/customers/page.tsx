"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CustomerList from "@/components/customers/CustomerList";
import {
  deleteCustomer,
  getCustomers,
} from "@/lib/api/customers/customerApi";

import type { Customer } from "@/types/customer/customer";

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomers({
        per_page: 100,
        search: search || undefined,
        status: status || undefined,
      });

      setCustomers(response.data?.data || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search, status]);

  async function handleDelete(customer: Customer) {
    if (!window.confirm(`Delete customer "${customer.name}"?`)) {
      return;
    }

    try {
      await deleteCustomer(customer.id);
      await load();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Unable to delete customer."
      );
    }
  }

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(
      (x) => x.status === "active"
    ).length,
    inactive: customers.filter(
      (x) => x.status === "inactive"
    ).length,
  }), [customers]);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              CRM MANAGEMENT
            </div>

            <h1 style={titleStyle}>
              Customers
            </h1>

            <p style={subtitleStyle}>
              Manage your customers and customer relationships.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/crm/customers/create")
            }
            style={primaryButtonStyle}
          >
            + Add Customer
          </button>
        </header>

        <div style={statsGridStyle}>
          <Stat label="Total Customers" value={stats.total} />
          <Stat label="Active" value={stats.active} />
          <Stat label="Inactive" value={stats.inactive} />
        </div>

        <div style={filterStyle}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email or company..."
            style={inputStyle}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <CustomerList
          customers={customers}
          loading={loading}
          onEdit={(customer) =>
            router.push(
              `/crm/customers/${customer.id}/edit`
            )
          }
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={statStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f6f8fb",
  padding: "34px 24px 60px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1350,
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 20,
  marginBottom: 25,
};

const eyebrowStyle: React.CSSProperties = {
  color: "#0f766e",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: ".08em",
  marginBottom: 9,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 30,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: "7px 0 0",
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
  fontWeight: 700,
  cursor: "pointer",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 14,
  marginBottom: 18,
};

const statStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 13,
  padding: 18,
};

const filterStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 180px",
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
};

const selectStyle: React.CSSProperties = {
  height: 40,
  border: "1px solid #dbe3ec",
  borderRadius: 8,
  background: "#fff",
  padding: "0 10px",
};

const errorStyle: React.CSSProperties = {
  padding: 14,
  marginBottom: 18,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 10,
  color: "#b91c1c",
};

