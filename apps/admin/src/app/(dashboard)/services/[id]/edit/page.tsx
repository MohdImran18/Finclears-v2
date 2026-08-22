"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ServiceForm from "@/components/services/ServiceForm";
import ServiceFaqEditor from "@/components/services/faqs/ServiceFaqEditor";
import {
  getService,
  getServiceCategories,
  updateService,
} from "@/lib/api/services/serviceApi";

import type {
  Service,
  ServiceCategory,
  ServicePayload,
} from "@/types/service/service";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [service, setService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!id || Number.isNaN(id)) {
        setError("Invalid service ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [serviceResponse, categoriesResponse] =
          await Promise.all([
            getService(id),
            getServiceCategories(),
          ]);

        setService(serviceResponse.data?.service || null);

        setCategories(
          categoriesResponse.data?.categories || []
        );
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load service."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleSubmit(payload: ServicePayload) {
    try {
      setSaving(true);
      setError("");

      await updateService(id, payload);

      router.push("/services");
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update service."
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
            Edit Service
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Update service information and publishing settings.
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

        {loading ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 24,
              color: "#64748b",
            }}
          >
            Loading service...
          </div>
        ) : !service ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #fecaca",
              borderRadius: 14,
              padding: 24,
              color: "#b91c1c",
            }}
          >
            Service not found.
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
            initial={service}
            categories={categories}
            loading={saving}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
}


