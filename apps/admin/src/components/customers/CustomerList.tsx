"use client";

import {
  Building2,
  Edit3,
  Mail,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";

import type { Customer } from "@/types/customer/customer";

interface Props {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerList({
  customers,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="customerState">
        <div className="loadingSpinner" />
        <strong>Loading customers...</strong>
        <span>Please wait while CRM data is being loaded.</span>

        <style jsx>{styles}</style>
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="customerState">
        <div className="emptyIcon">
          <UserRound size={24} />
        </div>

        <strong>No customers found</strong>

        <span>
          Try changing your search or filter, or add a new
          customer.
        </span>

        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="customerTableWrapper">
      <div className="customerTableScroll">
        <table className="customerTable">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Company</th>
              <th>Customer Value</th>
              <th>Status</th>
              <th className="actionsHeader">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => {
              const isActive =
                customer.status?.toLowerCase() === "active";

              return (
                <tr key={customer.id}>

                  <td>
                    <div className="customerIdentity">

                      <div className="avatar">
                        {getInitials(customer.name)}
                      </div>

                      <div className="customerInfo">
                        <strong>
                          {customer.name || "Unnamed Customer"}
                        </strong>

                        <span>
                          Customer ID #{customer.id}
                        </span>
                      </div>

                    </div>
                  </td>

                  <td>
                    <div className="contactInfo">

                      <div className="contactLine">
                        <Phone size={13} />
                        <span>
                          {customer.phone || "—"}
                        </span>
                      </div>

                      <div className="contactLine secondary">
                        <Mail size={13} />
                        <span>
                          {customer.email || "No email"}
                        </span>
                      </div>

                    </div>
                  </td>

                  <td>
                    <div className="companyInfo">

                      <Building2 size={15} />

                      <span>
                        {customer.company_name || "Individual"}
                      </span>

                    </div>
                  </td>

                  <td>
                    <div className="valueInfo">
                      ₹
                      {Number(
                        customer.total_value || 0
                      ).toLocaleString("en-IN")}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`statusBadge ${
                        isActive
                          ? "statusActive"
                          : "statusInactive"
                      }`}
                    >
                      <span className="statusDot" />
                      {customer.status || "Unknown"}
                    </span>
                  </td>

                  <td>
                    <div className="actions">

                      <button
                        type="button"
                        className="editButton"
                        onClick={() => onEdit(customer)}
                        title="Edit customer"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="deleteButton"
                        onClick={() => onDelete(customer)}
                        title="Delete customer"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="tableFooter">
        <span>
          Showing <strong>{customers.length}</strong>{" "}
          customer{customers.length === 1 ? "" : "s"}
        </span>

        <span className="footerHint">
          Customer records
        </span>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

function getInitials(name?: string) {
  if (!name) return "CU";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
}

const styles = `
  .customerTableWrapper {
    width: 100%;
    background: #ffffff;
  }

  .customerTableScroll {
    width: 100%;
    overflow-x: auto;
  }

  .customerTable {
    width: 100%;
    min-width: 980px;
    border-collapse: collapse;
  }

  .customerTable th {
    height: 45px;
    padding: 0 17px;
    text-align: left;
    white-space: nowrap;
    background: #f8fbfd;
    border-bottom: 1px solid #e3ebf3;
    color: #627d98;
    font-size: 10px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: .065em;
    text-transform: uppercase;
  }

  .customerTable td {
    padding: 14px 17px;
    border-bottom: 1px solid #edf2f7;
    vertical-align: middle;
    color: #243b53;
    font-size: 12px;
  }

  .customerTable tbody tr {
    transition: background .15s ease;
  }

  .customerTable tbody tr:hover {
    background: #f9fcff;
  }

  .customerTable tbody tr:last-child td {
    border-bottom: 0;
  }

  .actionsHeader {
    text-align: right !important;
  }

  .customerIdentity {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 190px;
  }

  .avatar {
    width: 37px;
    height: 37px;
    flex: 0 0 37px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #eaf3fb;
    border: 1px solid #d8e9f6;
    color: #1769aa;
    font-size: 11px;
    font-weight: 800;
  }

  .customerInfo {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .customerInfo strong {
    color: #243b53;
    font-size: 12px;
    line-height: 1.25;
    font-weight: 750;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 190px;
  }

  .customerInfo span {
    color: #9fb3c8;
    font-size: 10px;
    line-height: 1.2;
  }

  .contactInfo {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 155px;
  }

  .contactLine {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #486581;
    font-size: 11px;
    white-space: nowrap;
  }

  .contactLine svg {
    color: #6b9bc0;
    flex: 0 0 auto;
  }

  .contactLine.secondary {
    color: #829ab1;
    font-size: 10px;
  }

  .companyInfo {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 130px;
    color: #486581;
    font-size: 11px;
  }

  .companyInfo svg {
    color: #7da8c8;
    flex: 0 0 auto;
  }

  .companyInfo span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .valueInfo {
    color: #102a43;
    font-size: 12px;
    font-weight: 750;
    white-space: nowrap;
  }

  .statusBadge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 65px;
    justify-content: center;
    padding: 5px 9px;
    border-radius: 999px;
    font-size: 10px;
    line-height: 1;
    font-weight: 750;
    text-transform: capitalize;
  }

  .statusDot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .statusActive {
    background: #edf9f3;
    border: 1px solid #d3efdf;
    color: #147d4f;
  }

  .statusActive .statusDot {
    background: #22a866;
  }

  .statusInactive {
    background: #f3f6f8;
    border: 1px solid #e0e7ed;
    color: #718096;
  }

  .statusInactive .statusDot {
    background: #94a3b8;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }

  .editButton,
  .deleteButton {
    height: 31px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 9px;
    border-radius: 7px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: .16s ease;
  }

  .editButton {
    border: 1px solid #d3e3ef;
    background: #f8fbfd;
    color: #1769aa;
  }

  .editButton:hover {
    border-color: #9fc2db;
    background: #eaf3fb;
  }

  .deleteButton {
    border: 1px solid #f0d7d7;
    background: #fffafa;
    color: #c24141;
  }

  .deleteButton:hover {
    border-color: #e7b5b5;
    background: #fff2f2;
  }

  .tableFooter {
    min-height: 43px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 17px;
    border-top: 1px solid #e7eef5;
    color: #829ab1;
    font-size: 10px;
    box-sizing: border-box;
  }

  .tableFooter strong {
    color: #486581;
    font-weight: 750;
  }

  .footerHint {
    color: #9fb3c8;
  }

  .customerState {
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 7px;
    padding: 35px;
    background: #ffffff;
    color: #486581;
    text-align: center;
  }

  .customerState strong {
    color: #243b53;
    font-size: 13px;
  }

  .customerState span {
    color: #829ab1;
    font-size: 11px;
  }

  .emptyIcon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    margin-bottom: 4px;
    border-radius: 12px;
    background: #eaf3fb;
    color: #1769aa;
  }

  .loadingSpinner {
    width: 25px;
    height: 25px;
    margin-bottom: 5px;
    border: 3px solid #dceaf5;
    border-top-color: #1769aa;
    border-radius: 50%;
    animation: customerSpin .75s linear infinite;
  }

  @keyframes customerSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 700px) {
    .customerTable th,
    .customerTable td {
      padding-left: 12px;
      padding-right: 12px;
    }

    .tableFooter {
      padding: 0 12px;
    }

    .footerHint {
      display: none;
    }
  }
`;
