/* ==========================================================
 | Company Enums
 * ========================================================= */
export type CompanyStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "documents_pending"
  | "payment_pending"
  | "processing"
  | "approved"
  | "rejected"
  | "completed";

export type CompanyServiceType =
  | "private_limited"
  | "llp"
  | "opc"
  | "section8"
  | "foreign_company";

export type CompanyType =
  | "private"
  | "public"
  | "llp"
  | "opc";

/* ==========================================================
 | Address
 * ========================================================= */

export interface CompanyAddress {
  registered_address: string;
  address_line_2?: string;

  city: string;
  district: string;
  state: string;

  pin_code: string;

  police_station?: string;

  ownership_type:
    | "owned"
    | "rented"
    | "leased";
}

/* ==========================================================
 | Director / Promoter
 * ========================================================= */

export interface Director {
  id?: number;

  name: string;

  father_name: string;

  email: string;

  mobile: string;

  pan: string;

  aadhaar: string;

  din?: string;

  nationality: string;

  occupation: string;

  designation?: string;

  shareholding: number;

  is_signing_director?: boolean;
}

/* ==========================================================
 | Shareholder
 * ========================================================= */

export interface Shareholder {
  id?: number;

  name: string;

  pan: string;

  shares: number;

  percentage: number;
}



/* ==========================================================
 | Company Documents
 * ========================================================= */

export type DocumentType =
  | "pan_card"
  | "aadhaar_card"
  | "passport_photo"
  | "electricity_bill"
  | "rent_agreement"
  | "noc"
  | "moa"
  | "aoa"
  | "inc9"
  | "spice_plus"
  | "agile_pro"
  | "proof_of_identity"
  | "proof_of_address"
  | "other";

/* ==========================================================
 | Company Document
 * ========================================================= */

export interface CompanyDocument {
  id: number;
  company_id: number;
  title: string;
  file_name: string;
  file_url: string;
  type: DocumentType;
  status?: string;
  created_at: string;
  updated_at: string;
}

/* ==========================================================
 | Company
 * ========================================================= */

export interface Company {
  id: number;

  name: string;

  company_name?: string;

  company_type?: CompanyType;

  service_type?: CompanyServiceType;

  business_activity?: string;

  authorized_capital?: number;

  paid_up_capital?: number;

  registration_number?: string;

  cin?: string;

  llpin?: string;

  gst_number?: string;

  pan_number?: string;

  tan_number?: string;

  email?: string;

  phone?: string;

  website?: string;

  address?: string;

  city?: string;

  district?: string;

  state?: string;

  country?: string;

  pin_code?: string;

  owner_name?: string;

  contact_person?: string;

  incorporation_date?: string;

  status?: CompanyStatus;

  created_at?: string;

  updated_at?: string;
}
/* ==========================================================
 | Company Timeline
 * ========================================================= */

export interface CompanyTimeline {
  id: number;

  title: string;

  description?: string;

  status: CompanyStatus;

  created_by?: number;

  created_at: string;
}

/* ==========================================================
 | Activity Log
 * ========================================================= */

export interface CompanyActivity {
  id: number;

  action: string;

  description: string;

  performed_by: string;

  created_at: string;
}

/* ==========================================================
 | Invoice
 * ========================================================= */

export interface CompanyInvoice {
  id: number;

  invoice_no: string;

  subtotal: number;

  tax: number;

  discount: number;

  total: number;

  paid: boolean;

  due_date?: string;

  invoice_url?: string;

  created_at: string;
}

/* ==========================================================
 | Payment
 * ========================================================= */

export interface CompanyPayment {
  id: number;

  amount: number;

  currency: string;

  method:
    | "razorpay"
    | "cashfree"
    | "bank_transfer"
    | "cash";

  payment_status:
    | "pending"
    | "success"
    | "failed"
    | "refunded";

  transaction_id?: string;

  payment_date?: string;
}

/* ==========================================================
 | MCA Status
 * ========================================================= */

export interface MCAStatus {
  cin?: string;

  llpin?: string;

  incorporation_date?: string;

  company_status?: string;

  roc?: string;

  last_synced_at?: string;
}

/* ==========================================================
 | Compliance
 * ========================================================= */

export interface ComplianceItem {
  id: number;

  title: string;

  due_date: string;

  status:
    | "pending"
    | "completed"
    | "overdue";

  mandatory: boolean;
}

/* ==========================================================
 | Dashboard Stats
 * ========================================================= */

export interface CompanyDashboard {
  total_documents: number;

  verified_documents: number;

  pending_documents: number;

  completed_steps: number;

  total_steps: number;

  completion_percentage: number;
}
/* ==========================================================
 | Wizard Forms
 * ========================================================= */

export interface CreateCompanyRequest {
  company_name: string;

  service_type: CompanyServiceType;

  company_type: CompanyType;

  business_activity: string;

  authorized_capital: number;

  paid_up_capital: number;

  state: string;

  city: string;

  address: string;

  pin_code: string;

  promoters?: Director[];
}

export interface UpdateCompanyRequest
  extends Partial<CreateCompanyRequest> {}

/* ==========================================================
 | Business Form
 * ========================================================= */

export interface BusinessFormRequest {
  company_name: string;

  service_type: CompanyServiceType;

  company_type: CompanyType;

  business_activity: string;

  authorized_capital: number;

  paid_up_capital: number;

  state: string;

  city: string;

  address: string;

  pin_code: string;
}

/* ==========================================================
 | Promoter Form
 * ========================================================= */

export interface PromoterFormRequest {
  promoters: Director[];
}

/* ==========================================================
 | Address Form
 * ========================================================= */

export interface AddressFormRequest {
  registered_address: string;

  address_line_2?: string;

  city: string;

  district: string;

  state: string;

  pin_code: string;

  police_station?: string;

  ownership_type:
    | "owned"
    | "rented"
    | "leased";

  electricity_bill?: FileList;

  rent_agreement?: FileList;

  noc?: FileList;
}

/* ==========================================================
 | Documents Form
 * ========================================================= */

export interface DocumentsFormRequest {
  pan_card?: FileList;

  aadhaar_card?: FileList;

  passport_photo?: FileList;

  electricity_bill?: FileList;

  rent_agreement?: FileList;

  noc?: FileList;
}

/* ==========================================================
 | Filters
 * ========================================================= */

export interface CompanyFilters {
  search?: string;

  status?: CompanyStatus;

  service_type?: CompanyServiceType;

  page?: number;

  per_page?: number;
}

/* ==========================================================
 | Pagination
 * ========================================================= */

export interface PaginationMeta {
  current_page: number;

  last_page: number;

  per_page: number;

  total: number;
}

/* ==========================================================
 | API Responses
 * ========================================================= */

export interface CompanyResponse {
  success: boolean;

  message: string;

  data: Company;
}

export interface CompanyListResponse {
  success: boolean;

  message: string;

  data: Company[];

  meta: PaginationMeta;
}

export interface CompanyStatusResponse {
  success: boolean;

  data: MCAStatus;
}

/* ==========================================================
 | Upload Response
 * ========================================================= */

export interface UploadResponse {
  success: boolean;

  message: string;

  data: CompanyDocument;
}

/* ==========================================================
 | Dashboard Response
 * ========================================================= */

export interface CompanyDashboardResponse {
  success: boolean;

  data: CompanyDashboard;
}
