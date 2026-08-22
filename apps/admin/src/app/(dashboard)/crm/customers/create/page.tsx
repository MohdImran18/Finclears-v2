"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import { createCustomer } from "@/lib/api/customers/customerApi";

export default function CreateCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alternate_phone: "",
    company_name: "",
    status: "active",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      await createCustomer({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        alternate_phone:
          form.alternate_phone.trim() || undefined,
        company_name:
          form.company_name.trim() || undefined,
        status: form.status,
        notes: form.notes.trim() || undefined,
      });

      router.push("/crm/customers");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to create customer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="createPage">
      <div className="createContainer">

        <div className="pageHeader">

          <button
            type="button"
            className="backButton"
            onClick={() =>
              router.push("/crm/customers")
            }
          >
            <ArrowLeft size={15} />
            Customers
          </button>

          <div className="eyebrow">
            CRM MANAGEMENT
          </div>

          <h1>Add New Customer</h1>

          <p>
            Create a customer record and keep all
            relationship information organized.
          </p>

        </div>

        {error && (
          <div className="errorBox">
            <div className="errorIcon">!</div>
            <div>
              <strong>Unable to create customer</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="formCard"
        >

          <div className="formHeader">
            <div className="formHeaderIcon">
              <UserRound size={19} />
            </div>

            <div>
              <h2>Customer Information</h2>
              <p>
                Enter the basic information for this
                customer.
              </p>
            </div>
          </div>

          <div className="formGrid">

            <Field
              icon={<UserRound size={15} />}
              label="Customer Name"
              required
              value={form.name}
              onChange={(v) =>
                update("name", v)
              }
              placeholder="Enter customer name"
            />

            <Field
              icon={<Phone size={15} />}
              label="Phone Number"
              required
              value={form.phone}
              onChange={(v) =>
                update("phone", v)
              }
              placeholder="Enter phone number"
            />

            <Field
              icon={<Mail size={15} />}
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(v) =>
                update("email", v)
              }
              placeholder="customer@example.com"
            />

            <Field
              icon={<Phone size={15} />}
              label="Alternate Phone"
              value={form.alternate_phone}
              onChange={(v) =>
                update("alternate_phone", v)
              }
              placeholder="Alternate phone number"
            />

            <Field
              icon={<Building2 size={15} />}
              label="Company Name"
              value={form.company_name}
              onChange={(v) =>
                update("company_name", v)
              }
              placeholder="Company or business name"
            />

            <div className="field">

              <label>
                Status
              </label>

              <div className="inputWrap">
                <CheckCircle2 size={15} />

                <select
                  value={form.status}
                  onChange={(e) =>
                    update(
                      "status",
                      e.target.value
                    )
                  }
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

          </div>

          <div className="notesSection">

            <label>
              <FileText size={14} />
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                update("notes", e.target.value)
              }
              placeholder="Add any important customer notes..."
              rows={5}
            />

            <span>
              Optional internal notes for CRM management.
            </span>

          </div>

          <div className="formFooter">

            <button
              type="button"
              className="cancelButton"
              onClick={() =>
                router.push("/crm/customers")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="saveButton"
              disabled={loading}
            >
              <Save size={15} />

              {loading
                ? "Creating..."
                : "Create Customer"}
            </button>

          </div>

        </form>

      </div>

      <style jsx>{styles}</style>
    </main>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="field">

      <label>
        {label}
        {required && (
          <span className="required">*</span>
        )}
      </label>

      <div className="inputWrap">

        {icon}

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          required={required}
        />

      </div>

    </div>
  );
}

const styles = `
  .createPage {
    min-height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: #f7fafd;
    padding: 30px 30px 55px;
  }

  .createContainer {
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
  }

  .pageHeader {
    margin-bottom: 22px;
  }

  .backButton {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 17px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #486581;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .backButton:hover {
    color: #1769aa;
  }

  .eyebrow {
    margin-bottom: 7px;
    color: #2878b8;
    font-size: 10px;
    font-weight: 850;
    letter-spacing: .09em;
  }

  .pageHeader h1 {
    margin: 0;
    color: #102a43;
    font-size: 27px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -.02em;
  }

  .pageHeader p {
    margin: 7px 0 0;
    color: #829ab1;
    font-size: 12px;
    line-height: 1.5;
  }

  .errorBox {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
    padding: 12px 14px;
    border: 1px solid #f2caca;
    border-radius: 10px;
    background: #fff8f8;
    color: #b42318;
  }

  .errorIcon {
    width: 21px;
    height: 21px;
    display: grid;
    place-items: center;
    flex: 0 0 21px;
    border-radius: 50%;
    background: #fee2e2;
    font-size: 11px;
    font-weight: 800;
  }

  .errorBox div:last-child {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .errorBox strong {
    font-size: 11px;
  }

  .errorBox span {
    font-size: 11px;
  }

  .formCard {
    overflow: hidden;
    border: 1px solid #e1eaf2;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(16, 42, 67, .035);
  }

  .formHeader {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 19px 21px;
    border-bottom: 1px solid #e8eef4;
    background: #fbfdff;
  }

  .formHeaderIcon {
    width: 37px;
    height: 37px;
    display: grid;
    place-items: center;
    border: 1px solid #d6e7f4;
    border-radius: 9px;
    background: #eaf3fb;
    color: #1769aa;
  }

  .formHeader h2 {
    margin: 0;
    color: #243b53;
    font-size: 13px;
    font-weight: 800;
  }

  .formHeader p {
    margin: 3px 0 0;
    color: #829ab1;
    font-size: 10px;
  }

  .formGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 19px 20px;
    padding: 22px;
  }

  .field {
    min-width: 0;
  }

  .field label,
  .notesSection label {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 7px;
    color: #334e68;
    font-size: 11px;
    font-weight: 750;
  }

  .required {
    color: #d14343;
  }

  .inputWrap {
    height: 41px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    padding: 0 11px;
    border: 1px solid #d9e4ed;
    border-radius: 8px;
    background: #ffffff;
    color: #8aa5ba;
    transition: .15s ease;
  }

  .inputWrap:focus-within {
    border-color: #73a9ce;
    box-shadow: 0 0 0 3px #edf5fb;
  }

  .inputWrap input,
  .inputWrap select {
    width: 100%;
    height: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #243b53;
    font: inherit;
    font-size: 12px;
  }

  .inputWrap input::placeholder {
    color: #a9bac9;
  }

  .inputWrap select {
    cursor: pointer;
  }

  .notesSection {
    padding: 0 22px 22px;
  }

  .notesSection label {
    margin-bottom: 7px;
  }

  .notesSection textarea {
    width: 100%;
    min-height: 105px;
    box-sizing: border-box;
    resize: vertical;
    padding: 11px 12px;
    border: 1px solid #d9e4ed;
    border-radius: 8px;
    outline: 0;
    background: #ffffff;
    color: #243b53;
    font-family: inherit;
    font-size: 12px;
    line-height: 1.5;
  }

  .notesSection textarea:focus {
    border-color: #73a9ce;
    box-shadow: 0 0 0 3px #edf5fb;
  }

  .notesSection textarea::placeholder {
    color: #a9bac9;
  }

  .notesSection > span {
    display: block;
    margin-top: 6px;
    color: #9fb3c8;
    font-size: 10px;
  }

  .formFooter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
    padding: 15px 22px;
    border-top: 1px solid #e8eef4;
    background: #fbfdff;
  }

  .cancelButton,
  .saveButton {
    height: 37px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 14px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 750;
    cursor: pointer;
    transition: .15s ease;
  }

  .cancelButton {
    border: 1px solid #d4e0e9;
    background: #ffffff;
    color: #486581;
  }

  .cancelButton:hover:not(:disabled) {
    background: #f4f8fb;
  }

  .saveButton {
    border: 1px solid #1769aa;
    background: #1769aa;
    color: #ffffff;
    box-shadow: 0 2px 5px rgba(23, 105, 170, .15);
  }

  .saveButton:hover:not(:disabled) {
    background: #155f98;
  }

  .cancelButton:disabled,
  .saveButton:disabled {
    cursor: not-allowed;
    opacity: .6;
  }

  @media (max-width: 760px) {
    .createPage {
      padding: 22px 16px 40px;
    }

    .formGrid {
      grid-template-columns: 1fr;
      gap: 17px;
      padding: 18px;
    }

    .notesSection {
      padding: 0 18px 18px;
    }

    .formHeader {
      padding: 17px 18px;
    }

    .formFooter {
      padding: 14px 18px;
    }

    .pageHeader h1 {
      font-size: 24px;
    }
  }
`;
