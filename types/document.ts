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
  | "electricity_bill"
  | "rent_agreement"
  | "noc"
  | "gst"
  | "bank_statement"
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

  company_id: number;

  order_id?: number;

  type: DocumentType;

  title: string;

  file_name: string;

  file_url: string;

  mime_type: string;

  extension: string;

  size: number;

  status: DocumentStatus;

  remarks?: string;

  uploaded_by?: number;

  verified_by?: number;

  verified_at?: string;

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

  page?: number;

  per_page?: number;

}

/* ==========================================================
 | Upload Request
 * ========================================================= */

export interface UploadDocumentRequest {

  company_id: number;

  type: DocumentType;

  file: File;

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

}