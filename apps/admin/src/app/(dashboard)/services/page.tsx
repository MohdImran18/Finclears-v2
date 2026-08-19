"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ServiceList from "@/components/services/ServiceList";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceDeleteDialog from "@/components/services/ServiceDeleteDialog";

import {
  deleteService,
  getServices,
} from "@/lib/api/services/serviceApi";

import type { Service } from "@/types/service/service";

export default function ServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);

  async function load() {
    try {
      setLoading(true);

      const response = await getServices({
        per_page: 15,
        search: search || undefined,
        status:
          status === ""
            ? undefined
            : status === "1",
        featured:
          featured === ""
            ? undefined
            : featured === "1",
      });

      setServices(response.data.services || []);
    } catch (error) {
      console.error(error);
      alert(
        "Unable to load services. Please login again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search, status, featured]);

  async function remove() {
    if (!selected) return;

    try {
      setDeleting(true);

      await deleteService(selected.id);

      setSelected(null);

      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete service."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main
      style={{
        padding: 30,
        maxWidth: 1400,
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
              color: "#0f172a",
            }}
          >
            Service Management
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
            }}
          >
            Manage services displayed on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/services/create")}
          style={{
            border: 0,
            borderRadius: 9,
            padding: "12px 17px",
            background: "#111827",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Create Service
        </button>
      </div>

      <ServiceFilters
        search={search}
        status={status}
        featured={featured}
        onSearch={setSearch}
        onStatus={setStatus}
        onFeatured={setFeatured}
      />

      <ServiceList
        services={services}
        loading={loading}
        onEdit={(id) =>
          router.push(`/services/${id}/edit`)
        }
        onDelete={setSelected}
      />

      <ServiceDeleteDialog
        open={!!selected}
        title={selected?.title}
        loading={deleting}
        onCancel={() => setSelected(null)}
        onConfirm={remove}
      />
    </main>
  );
}