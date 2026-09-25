import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export async function getLeadReports(
  from?: string,
  to?: string
) {
  const response = await client.get("/reports/leads", {
    params: {
      from,
      to,
    },
  });

  return response.data;
}

export async function exportLeadReports(
  from?: string,
  to?: string
) {
  const response = await client.get(
    "/reports/leads/export",
    {
      params: { from, to },
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "lead-report.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}