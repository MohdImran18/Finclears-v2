"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getBlogs } from "@/lib/api/blogs/blogApi";
import { getServices } from "@/lib/api/services/serviceApi";
import { getLeads } from "@/lib/api/leads/leadApi";

export default function HomePage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState(0);
  const [services, setServices] = useState(0);
  const [leads, setLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [blogRes, serviceRes, leadRes] =
          await Promise.all([
            getBlogs({}),
            getServices({}),
            getLeads({ per_page: 1 }),
          ]);

        setBlogs(blogRes?.data?.blogs?.length ?? 0);
        setServices(serviceRes?.data?.services?.length ?? 0);
        setLeads(leadRes?.data?.total ?? 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              color: "#0f766e",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".08em",
              marginBottom: 8,
            }}
          >
            FINCLEARS ADMIN
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              color: "#0f172a",
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#64748b",
            }}
          >
            Manage CRM, operations, services and website content.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <Card
            title="Total Leads"
            value={loading ? "—" : leads}
            onClick={() => router.push("/crm/leads")}
          />

          <Card
            title="Customers"
            value="CRM"
            onClick={() => router.push("/crm/customers")}
          />

          <Card
            title="Services"
            value={loading ? "—" : services}
            onClick={() => router.push("/services")}
          />

          <Card
            title="Blogs"
            value={loading ? "—" : blogs}
            onClick={() => router.push("/blogs")}
          />
        </div>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: 20,
              color: "#0f172a",
            }}
          >
            Admin Modules
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {[
              ["CRM", "/crm/leads"],
              ["Orders", "#"],
              ["CA / Operations", "#"],
              ["Support", "#"],
              ["Services", "/services"],
              ["Blog", "/blogs"],
              ["Payments", "#"],
              ["Reports", "#"],
              ["Notifications", "#"],
              ["Users & Roles", "#"],
              ["Settings", "#"],
            ].map(([label, href]) => (
              <button
                key={label}
                type="button"
                onClick={() => href !== "#" && router.push(href)}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: 10,
                  cursor: href === "#" ? "default" : "pointer",
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  value,
  onClick,
}: {
  title: string;
  value: string | number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: "left",
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 20,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#0f172a",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </button>
  );
}
