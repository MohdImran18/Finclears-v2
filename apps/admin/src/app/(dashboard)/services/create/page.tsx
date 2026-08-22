"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ServiceForm from "@/components/services/ServiceForm";
import {
  createService,
  getServiceCategories,
} from "@/lib/api/services/serviceApi";

import type { ServiceCategory } from "@/types/service/service";
import type { ServicePayload } from "@/types/service/service";

export default function CreateServicePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        setError("");

        const response = await getServiceCategories();

        setCategories(response.data?.categories || []);
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load service categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(payload: ServicePayload) {
    try {
      setSaving(true);
      setError("");

      await createService(payload);

      router.push("/services");
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create service."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "34px 24px 60px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <header style={{ marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => router.push("/services")}
            style={{
              border: 0,
              background: "transparent",
              padding: 0,
              marginBottom: 12,
              color: "#2563eb",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Back to Services
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Create Service
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Add a new service to the Finclears website.
          </p>
        </header>

        {error && (
          <div
            style={{
              marginBottom: 18,
              padding: 14,
              borderRadius: 10,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {loadingCategories ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 24,
              color: "#64748b",
            }}
          >
            Loading service categories...
          </div>
        ) : categories.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #fecaca",
              borderRadius: 14,
              padding: 24,
              color: "#b91c1c",
            }}
          >
            No active service categories are available.
          </div>
        ) : (
          <ServiceForm
            categories={categories}
            loading={saving}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
}
