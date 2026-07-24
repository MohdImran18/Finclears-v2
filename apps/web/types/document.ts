/* ==========================================================
 | Document Status
 * ========================================================= */

export type DocumentStatus =
  | "pending"
  | "uploaded"
  | "under_review"
  | "verified"
  | "rejected";

/* ==========================================================
 | Document Type
 * ========================================================= */

export type DocumentType =
  | "pan"
  | "aadhaar"
  | "passport"
  | "photo"
  | "driving_license"
  | "electricity_bill"
  | "bank_statement"
  | "cancelled_cheque"
  | "gst"
  | "gst_certificate"
  | "iec_certificate"
  | "incorporation_certificate"
  | "financial_statement"
  | "itr"
  | "trademark_certificate"
  | "rent_agreement"
  | "noc"
  | "moa"
  | "aoa"
  | "spice_plus"
  | "inc9"
  | "agile"
  | "other";

/* ==========================================================
 | Document
 * ========================================================= */

export interface Document {
  id: number;

  company_id?: number | null;

  order_id?: number | null;

  title: string;

  document_type?: DocumentType;

  type: DocumentType;

  file_name: string;

  file_url: string;

  mime_type: string;

  extension: string;

  size: number;

  status: DocumentStatus;

  remarks?: string | null;

  uploaded_by?: number | null;

  verified_by?: number | null;

  verified_at?: string | null;

  created_at: string;

  updated_at: string;
}

/* ==========================================================
 | Filters
 * ========================================================= */

export interface DocumentFilters {
  search?: string;

  status?: DocumentStatus;

  type?: DocumentType;

  company_id?: number;

  order_id?: number;

  page?: number;

  per_page?: number;
}

/* ==========================================================
 | Upload Request
 * ========================================================= */

export interface UploadDocumentRequest {
  title: string;

  document_type: DocumentType;

  company_id?: number;

  order_id?: number;

  remarks?: string;

  file: File;
}

/* ==========================================================
 | Update Request
 * ========================================================= */

export interface UpdateDocumentRequest {
  title?: string;

  document_type?: DocumentType;

  remarks?: string;

  file?: File;
}

/* ==========================================================
 | Timeline
 * ========================================================= */

export interface DocumentTimelineItem {
  id: number;

  action: string;

  user: string;

  remarks?: string | null;

  created_at: string;
}

/* ==========================================================
 | Responses
 * ========================================================= */

export interface DocumentResponse {
  success: boolean;

  message: string;

  data: Document;
}

export interface DocumentListResponse {
  success: boolean;

  message: string;

  data: Document[];

  meta?: {
    current_page: number;

    last_page: number;

    per_page: number;

    total: number;
  };
}