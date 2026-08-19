"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ServiceForm from "@/components/services/ServiceForm";
import ServiceFaqEditor from "@/components/services/faqs/ServiceFaqEditor";

import ServiceBenefitsEditor from "@/components/services/benefits/ServiceBenefitsEditor";
import ServiceDocumentsEditor from "@/components/services/documents/ServiceDocumentsEditor";
import ServicePricingEditor from "@/components/services/pricing/ServicePricingEditor";
import ServiceProcessEditor from "@/components/services/process/ServiceProcessEditor";

import {
  getService,
  updateService,
} from "@/lib/api/services/serviceApi";

import type {
  Service,
  ServicePayload,
} from "@/types/service/service";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [service, setService] =
    useState<Service | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        setLoading(true);

        const response = await getService(id);

        setService(response.data.service);
      } catch (error) {
        console.error(error);

        alert("Unable to load service.");

        router.push("/services");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadService();
    }
  }, [id, router]);

  async function submit(payload: ServicePayload) {
    try {
      setSaving(true);

      await updateService(id, payload);

      alert("Service updated successfully.");

      router.push("/services");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to update service."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 30 }}>
        <p>Loading service...</p>
      </main>
    );
  }

  if (!service) {
    return (
      <main style={{ padding: 30 }}>
        <p>Service not found.</p>
      </main>
    );
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
          gap: 20,
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
            Edit Service
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
            }}
          >
            {service.title}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/services")}
          style={{
            padding: "10px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            background: "#fff",
            color: "#334155",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Services
        </button>
      </div>

      <ServiceForm
        initial={service}
        loading={saving}
        onSubmit={submit}
      />

      <ServiceFaqEditor serviceId={id} />

      <div
        style={{
          display: "grid",
          gap: 20,
          marginTop: 24,
        }}
      >
        <ServiceBenefitsEditor
          serviceId={service.id}
        />

        <ServiceDocumentsEditor
          serviceId={service.id}
        />

        <ServicePricingEditor
          serviceId={service.id}
        />

        <ServiceProcessEditor
          serviceId={service.id}
        />
      </div>
    </main>
  );
}