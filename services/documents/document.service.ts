import api from "@/lib/api";

import { API_ENDPOINTS } from "@/constants/api";

import type { DocumentFilters } from "@/types/document";

/* ==========================================================
 | Get All Documents
 * ========================================================= */

export async function getDocuments(
  filters?: DocumentFilters
) {
  const { data } = await api.get(
    API_ENDPOINTS.DOCUMENTS.INDEX
  );

  return data;
}

/* ==========================================================
 | Get Single Document
 * ========================================================= */

export async function getDocument(
  id: number | string
) {
  const { data } = await api.get(
    API_ENDPOINTS.DOCUMENTS.SHOW(id)
  );

  return data;
}

/* ==========================================================
 | Upload Document
 * ========================================================= */

export async function uploadDocument(
  payload: FormData | {
    company_id: number;
    type: string;
    file: File;
  }
) {

  const formData =
    payload instanceof FormData
      ? payload
      : (() => {
          const fd = new FormData();
          fd.append(
            "company_id",
            String(payload.company_id)
          );
          fd.append("type", payload.type);
          fd.append("file", payload.file);
          return fd;
        })();

  const { data } = await api.post(
    API_ENDPOINTS.DOCUMENTS.STORE,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return data;
}

/* ==========================================================
 | Update Document
 * ========================================================= */

export async function updateDocument(
  id: number | string,
  payload: unknown
) {
  const { data } = await api.put(
    API_ENDPOINTS.DOCUMENTS.UPDATE(id),
    payload
  );

  return data;
}

/* ==========================================================
 | Delete Document
 * ========================================================= */

export async function deleteDocument(
  id: number | string
) {
  const { data } = await api.delete(
    API_ENDPOINTS.DOCUMENTS.DELETE(id)
  );

  return data;
}

/* ==========================================================
 | Download Document
 * ========================================================= */

export async function downloadDocument(
  id: number | string
) {
  const { data } = await api.get(
    API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id),
    {
      responseType: "blob",
    }
  );

  return data;
}

/* ==========================================================
 | Verify Document
 * ========================================================= */

export async function verifyDocument(
  id: number | string
) {
  const { data } = await api.patch(
    `${API_ENDPOINTS.DOCUMENTS.SHOW(id)}/verify`
  );

  return data;
}

/* ==========================================================
 | Reject Document
 * ========================================================= */

export async function rejectDocument(
  id: number | string,
  reason: string
) {
  const { data } = await api.patch(
    `${API_ENDPOINTS.DOCUMENTS.SHOW(id)}/reject`,
    {
      reason,
    }
  );

  return data;
}
