"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";

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

  async function loadCustomers() {
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
    loadCustomers();
  }, [search, status]);

  async function handleDelete(customer: Customer) {
    if (
      !window.confirm(
        `Delete customer "${customer.name}"?`
      )
    ) {
      return;
    }

    try {
      await deleteCustomer(customer.id);
      await loadCustomers();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Unable to delete customer."
      );
    }
  }

  const stats = useMemo(
    () => ({
      total: customers.length,
      active: customers.filter(
        (customer) =>
          customer.status?.toLowerCase() === "active"
      ).length,
      inactive: customers.filter(
        (customer) =>
          customer.status?.toLowerCase() === "inactive"
      ).length,
    }),
    [customers]
  );

  const hasFilters = Boolean(search || status);

  function clearFilters() {
    setSearch("");
    setStatus("");
  }

  return (
    <main className="customersPage">
      <div className="customersContainer">

        <header className="customersHeader">
          <div>
            <div className="customersEyebrow">
              <span className="eyebrowIcon">
                <Users size={14} />
              </span>
              CRM / CUSTOMERS
            </div>

            <h1>Customers</h1>

            <p>
              Manage your customers and customer relationships
              from one place.
            </p>
          </div>

          <div className="headerActions">
            <button
              type="button"
              className="secondaryButton"
              onClick={loadCustomers}
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
              className="primaryButton"
              onClick={() =>
                router.push("/crm/customers/create")
              }
            >
              <UserPlus size={16} />
              Add Customer
            </button>
          </div>
        </header>

        <section className="statsGrid">

          <StatCard
            icon={<Users size={18} />}
            label="Total Customers"
            value={stats.total}
            description="All CRM customers"
          />

          <StatCard
            icon={<UserCheck size={18} />}
            label="Active"
            value={stats.active}
            description="Currently active"
          />

          <StatCard
            icon={<UserX size={18} />}
            label="Inactive"
            value={stats.inactive}
            description="Inactive customers"
          />

          <StatCard
            icon={<UserPlus size={18} />}
            label="New Records"
            value={customers.filter(
              (customer) => {
                if (!customer.created_at) return false;

                const created = new Date(
                  customer.created_at
                );

                const now = new Date();

                return (
                  created.getMonth() === now.getMonth() &&
                  created.getFullYear() === now.getFullYear()
                );
              }
            ).length}
            description="Added this month"
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              <strong>Unable to load customers</strong>
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadCustomers}
            >
              Retry
            </button>
          </div>
        )}

        <section className="tableCard">

          <div className="tableCardHeader">
            <div>
              <h2>Customer Management</h2>
              <p>
                {loading
                  ? "Loading CRM data..."
                  : `${customers.length} customer${
                      customers.length === 1
                        ? ""
                        : "s"
                    } found`}
              </p>
            </div>

            <button
              type="button"
              className="viewAllButton"
              onClick={loadCustomers}
            >
              Refresh data
              <RefreshCw size={13} />
            </button>
          </div>

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

        </section>

      </div>

      <style jsx>{`
        .customersPage {
          min-height: 100%;
          width: 100%;
          background: #f6f9fc;
          color: #102a43;
        }

        .customersContainer {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding: 30px 30px 40px;
          box-sizing: border-box;
        }

        .customersHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 24px;
        }

        .customersEyebrow {
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

        .customersHeader h1 {
          margin: 0;
          color: #102a43;
          font-size: 30px;
          line-height: 1.15;
          letter-spacing: -.025em;
          font-weight: 800;
        }

        .customersHeader p {
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
          background: white;
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
          .customersContainer {
            padding: 20px 14px 30px;
          }

          .customersHeader {
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
        <div className="statDescription">
          {description}
        </div>
      </div>
    </div>
  );
}
