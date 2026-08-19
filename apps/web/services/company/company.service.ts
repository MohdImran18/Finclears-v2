import { API_ENDPOINTS } from "@/constants/api";
import { del, get, post, put } from "@/lib/request";

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
        filters?: CompanyFilters,
): Promise<CompanyListResponse> {
        const response = await get<CompanyListResponse>(
                API_ENDPOINTS.COMPANIES.INDEX,
                filters,
        );

        const rawData = response.data as unknown;

        const companies = Array.isArray(rawData)
                ? rawData
                : (rawData as { companies?: Company[] } | null)?.companies ?? [];

        return {
                ...response,
                data: companies,
        };
}

/* ==========================================================
 | Get Company
 * ========================================================= */

export async function getCompany(id: number): Promise<CompanyResponse> {
        const response = await get<CompanyResponse & {
                data: Company | { company: Company };
        }>(
                API_ENDPOINTS.COMPANIES.SHOW(id),
        );

        const rawData = response.data as Company | { company: Company };

        const company =
                rawData &&
                typeof rawData === "object" &&
                "company" in rawData
                        ? rawData.company
                        : rawData;

        return {
                ...response,
                data: company,
        };
}

/* ==========================================================
 | Create Company
 * ========================================================= */

export async function createCompany(
        data: CreateCompanyRequest,
): Promise<CompanyResponse> {
        const response = await post<
                CompanyResponse & {
                        data: Company | { company: Company };
                }
        >(
                API_ENDPOINTS.COMPANIES.STORE,
                data,
        );

        const rawData = response.data as Company | { company: Company };

        const company =
                rawData &&
                typeof rawData === "object" &&
                "company" in rawData
                        ? rawData.company
                        : rawData;

        return {
                ...response,
                data: company,
        };
}

/* ==========================================================
 | Update Company
 * ========================================================= */

export async function updateCompany(
	id: number,
	data: UpdateCompanyRequest,
): Promise<CompanyResponse> {
	return put<CompanyResponse>(API_ENDPOINTS.COMPANIES.UPDATE(id), data);
}

/* ==========================================================
 | Delete Company
 * ========================================================= */

export async function deleteCompany(id: number): Promise<void> {
	return del<void>(API_ENDPOINTS.COMPANIES.DELETE(id));
}

/* ==========================================================
 | Save Draft
 * ========================================================= */

export async function saveDraft(
	data: Partial<CreateCompanyRequest>,
): Promise<CompanyResponse> {
	return post<CompanyResponse>(API_ENDPOINTS.COMPANIES.DRAFT, data);
}

/* ==========================================================
 | Upload Documents
 * ========================================================= */

export async function uploadDocuments(
	id: number,
	formData: FormData,
): Promise<CompanyResponse> {
	return post<CompanyResponse>(
		API_ENDPOINTS.COMPANIES.UPLOAD(id),
		formData as unknown as object,
	);
}

/* ==========================================================
 | Submit Company
 * ========================================================= */

export async function submitCompany(id: number): Promise<CompanyResponse> {
	return post<CompanyResponse>(API_ENDPOINTS.COMPANIES.SUBMIT(id));
}

/* ==========================================================
 | Company Status
 * ========================================================= */

export async function getStatus(id: number): Promise<CompanyStatusResponse> {
	return get<CompanyStatusResponse>(API_ENDPOINTS.COMPANIES.STATUS(id));
}

/* ==========================================================
 | Assign CA
 * ========================================================= */

export async function assignCA(
	companyId: number,
	caId: number,
): Promise<CompanyResponse> {
	return post<CompanyResponse>(API_ENDPOINTS.COMPANIES.ASSIGN_CA(companyId), {
		ca_id: caId,
	});
}

/* ==========================================================
 | MCA Status
 * ========================================================= */

export async function syncMCAStatus(
	id: number,
): Promise<CompanyStatusResponse> {
	return post<CompanyStatusResponse>(API_ENDPOINTS.COMPANIES.SYNC_STATUS(id));
}

/* ==========================================================
 | Shareholders
 * ========================================================== */

export interface CompanyShareholder {
        id: number;
        company_id: number;
        name: string;
        shares: string | number;
        percentage: string | number;
        created_at?: string;
        updated_at?: string;
}

export interface ShareholderPayload {
        name: string;
        shares: number;
        percentage: number;
}

export interface ShareholdersResponse {
        success: boolean;
        data: CompanyShareholder[];
}

export interface ShareholderResponse {
        success: boolean;
        message: string;
        data: {
                shareholder: CompanyShareholder;
        };
}

export interface DeleteShareholderResponse {
        success: boolean;
        message: string;
}

/**
 * Get shareholders for a company.
 */
export async function getShareholders(
        companyId: number,
): Promise<ShareholdersResponse> {
        return get<ShareholdersResponse>(
                API_ENDPOINTS.SHAREHOLDERS.INDEX(companyId),
        );
}

/**
 * Create shareholder for a company.
 */
export async function createShareholder(
        companyId: number,
        data: ShareholderPayload,
): Promise<ShareholderResponse> {
        return post<ShareholderResponse>(
                API_ENDPOINTS.SHAREHOLDERS.STORE(companyId),
                data,
        );
}

/**
 * Update shareholder.
 */
export async function updateShareholder(
        id: number,
        data: ShareholderPayload,
): Promise<ShareholderResponse> {
        return put<ShareholderResponse>(
                API_ENDPOINTS.SHAREHOLDERS.UPDATE(id),
                data,
        );
}

/**
 * Delete shareholder.
 */
export async function deleteShareholder(
        id: number,
): Promise<DeleteShareholderResponse> {
        return del<DeleteShareholderResponse>(
                API_ENDPOINTS.SHAREHOLDERS.DELETE(id),
        );
}
/* ==========================================================
 * Company Payments
 * ========================================================== */

export interface CompanyPaymentData {
        id: number;
        company_id: number;
        amount: string;
        currency: string;
        payment_status: "pending" | "success" | "failed" | "refunded";
        payment_gateway: "cashfree";
        gateway_order_id?: string | null;
        gateway_transaction_id?: string | null;
        payment_session_id?: string | null;
        paid_at?: string | null;
}

export interface CreateCompanyPaymentResponse {
        success: boolean;
        message: string;
        data: {
                payment: CompanyPaymentData;
                cashfree: {
                        order_id: string;
                        payment_session_id: string;
                };
        };
}

export interface VerifyCompanyPaymentResponse {
        success: boolean;
        message: string;
        data: {
                payment: CompanyPaymentData;
                verification: {
                        status: "success" | "pending" | "failed";
                        payment?: unknown;
                        payments?: unknown[];
                };
        };
}

export async function createCompanyPayment(
        companyId: number,
        amount: number,
): Promise<CreateCompanyPaymentResponse> {
        return post<CreateCompanyPaymentResponse>(
                API_ENDPOINTS.COMPANY_PAYMENTS.STORE,
                {
                        company_id: companyId,
                        amount,
                },
        );
}

export async function getCompanyPayment(
        paymentId: number,
) {
        return get<{
                success: boolean;
                data: {
                        payment: CompanyPaymentData;
                };
        }>(
                API_ENDPOINTS.COMPANY_PAYMENTS.SHOW(paymentId),
        );
}

export async function verifyCompanyPayment(
        paymentId: number,
): Promise<VerifyCompanyPaymentResponse> {
        return post<VerifyCompanyPaymentResponse>(
                API_ENDPOINTS.COMPANY_PAYMENTS.VERIFY(paymentId),
        );
}
