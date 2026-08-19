"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ServiceForm from "@/components/services/ServiceForm";
import { createService } from "@/lib/api/services/serviceApi";

import type { ServicePayload } from "@/types/service/service";

export default function CreateServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(payload: ServicePayload) {
    try {
      setLoading(true);

      await createService(payload);

      alert("Service created successfully.");

      router.push("/services");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to create service."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: 30,
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 26,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            Create Service
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
            }}
          >
            Add a new website service.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/services")}
          style={backButtonStyle}
        >
          Back to Services
        </button>
      </div>

      <ServiceForm
        loading={loading}
        onSubmit={submit}
      />
    </main>
  );
}

const backButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#fff",
  color: "#334155",
  fontWeight: 600,
  cursor: "pointer",
};