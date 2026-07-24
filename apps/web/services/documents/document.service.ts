import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

import type {
  DocumentFilters,
  UploadDocumentRequest,
} from "@/types/document";

/* ==========================================================
 | Get Documents
 * ========================================================= */

export async function getDocuments(
  params?: DocumentFilters
) {
  const { data } = await api.get(
    API_ENDPOINTS.DOCUMENTS.INDEX,
    {
      params,
    }
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
  payload: UploadDocumentRequest
) {
  const formData = new FormData();

  formData.append("title", payload.title);

  formData.append(
    "document_type",
    payload.document_type
  );

  if (payload.company_id) {
    formData.append(
      "company_id",
      String(payload.company_id)
    );
  }

  if (payload.order_id) {
    formData.append(
      "order_id",
      String(payload.order_id)
    );
  }

  if (payload.remarks) {
    formData.append(
      "remarks",
      payload.remarks
    );
  }

  formData.append(
    "file",
    payload.file
  );

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
  payload: FormData
) {
  const { data } = await api.post(
    API_ENDPOINTS.DOCUMENTS.UPDATE(id),
    payload,
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
    API_ENDPOINTS.DOCUMENTS.VERIFY(id)
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
    API_ENDPOINTS.DOCUMENTS.REJECT(id),
    {
      reason,
    }
  );

  return data;
}

/* ==========================================================
 | Timeline
 * ========================================================= */

export async function getDocumentTimeline(
  id: number | string
) {
  const { data } = await api.get(
    API_ENDPOINTS.DOCUMENTS.TIMELINE(id)
  );

  return data;
}