import { del, get, post, put } from "@/lib/request";

import { API_ENDPOINTS } from "@/constants/api";

import type {
  Company,
  CompanyFilters,
  CompanyListResponse,
  CompanyResponse,
  CompanyStatusResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types/company";

/* ==========================================================
 | Get Companies
 * ========================================================= */

export async function getCompanies(
  filters?: CompanyFilters
): Promise<CompanyListResponse> {
  return get<CompanyListResponse>(
    API_ENDPOINTS.COMPANIES.INDEX,
    filters
  );
}

/* ==========================================================
 | Get Company
 * ========================================================= */

export async function getCompany(
  id: number
): Promise<CompanyResponse> {
  return get<CompanyResponse>(
    API_ENDPOINTS.COMPANIES.SHOW(id)
  );
}

/* ==========================================================
 | Create Company
 * ========================================================= */

export async function createCompany(
  data: CreateCompanyRequest
): Promise<CompanyResponse> {
  return post<CompanyResponse>(
    API_ENDPOINTS.COMPANIES.STORE,
    data
  );
}

/* ==========================================================
 | Update Company
 * ========================================================= */

export async function updateCompany(
  id: number,
  data: UpdateCompanyRequest
): Promise<CompanyResponse> {
  return put<CompanyResponse>(
    API_ENDPOINTS.COMPANIES.UPDATE(id),
    data
  );
}

/* ==========================================================
 | Delete Company
 * ========================================================= */

export async function deleteCompany(
  id: number
): Promise<void> {
  return del<void>(
    API_ENDPOINTS.COMPANIES.DELETE(id)
  );
}

/* ==========================================================
 | Save Draft
 * ========================================================= */

export async function saveDraft(
  data: Partial<CreateCompanyRequest>
): Promise<CompanyResponse> {
  return post<CompanyResponse>(
    API_ENDPOINTS.COMPANIES.DRAFT,
    data
  );
}

/* ==========================================================
 | Upload Documents
 * ========================================================= */

export async function uploadDocuments(
  id: number,
  formData: FormData
): Promise<CompanyResponse> {
  return post<CompanyResponse>(
    API_ENDPOINTS.COMPANIES.UPLOAD(id),
    formData as unknown as object
  );
}

/* ==========================================================
 | Submit Company
 * ========================================================= */

export async function submitCompany(
  id: number
): Promise<CompanyResponse> {
  return post<CompanyResponse>(
    API_ENDPOINTS.COMPANIES.SUBMIT(id)
  );
}

/* ==========================================================
 | Company Status
 * ========================================================= */

export async function getStatus(
  id: number
): Promise<CompanyStatusResponse> {
  return get<CompanyStatusResponse>(
    API_ENDPOINTS.COMPANIES.STATUS(id)
  );
}

/* ==========================================================
 | Assign CA
 * ========================================================= */

export async function assignCA(
  companyId: number,
  caId: number
): Promise<CompanyResponse> {
  return post<CompanyResponse>(
    API_ENDPOINTS.COMPANIES.ASSIGN_CA(companyId),
    {
      ca_id: caId,
    }
  );
}

/* ==========================================================
 | MCA Status
 * ========================================================= */

export async function syncMCAStatus(
  id: number
): Promise<CompanyStatusResponse> {
  return post<CompanyStatusResponse>(
    API_ENDPOINTS.COMPANIES.SYNC_STATUS(id)
  );
}