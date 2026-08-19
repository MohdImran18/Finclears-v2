import api from "@/lib/api";

export interface VerifyPanPayload {
    itr_return_uuid: string;
    pan: string;
    name: string;
    date_of_birth: string;
}

export interface VerifyPanData {
    id?: number;
    pan: string;
    name_as_per_pan?: string;
    date_of_birth?: string;
    status:
        | "verified"
        | "failed"
        | "pending";
    name_match?: boolean;
    date_of_birth_match?: boolean;
    aadhaar_seeding_status?: string;
    transaction_id?: string;
    provider?: string;
    verified_at?: string;
}

export interface VerifyPanResponse {
    message?: string;
    data?: {
        verification?: VerifyPanData;
        provider?: {
            code?: number;
            timestamp?: number;
            data?: {
                pan?: string;
                category?: string;
                status?: string;
                remarks?: string | null;
                name_as_per_pan_match?: boolean;
                date_of_birth_match?: boolean;
                aadhaar_seeding_status?: string;
            };
            transaction_id?: string;
        };
    };
}

export interface SendAadhaarOtpPayload {
    itr_return_uuid: string;
    aadhaar: string;
}

export interface SendAadhaarOtpResponse {
    message?: string;
    data?: {
        reference_id?: string | number;
        aadhaar?: string;
        provider?: unknown;
    };
}

export interface VerifyAadhaarOtpPayload {
    itr_return_uuid: string;
    aadhaar: string;
    reference_id: string;
    otp: string;
}

export interface VerifyAadhaarOtpResponse {
    message?: string;
    data?: {
        verification?: {
            id?: number;
            status?: "verified" | "failed";
            aadhaar?: string;
            reference_id?: string;
            transaction_id?: string;
            name?: string;
            date_of_birth?: string;
            gender?: string;
            verified_at?: string;
            provider?: string;
        };
        provider?: unknown;
    };
}

class KycService {
    async verifyPan(
        payload: VerifyPanPayload
    ) {
        return api.post<VerifyPanResponse>(
            "/kyc/pan/verify",
            payload
        );
    }

    async sendAadhaarOtp(
        payload: SendAadhaarOtpPayload
    ) {
        return api.post<SendAadhaarOtpResponse>(
            "/kyc/aadhaar/send-otp",
            payload
        );
    }

    async verifyAadhaarOtp(
        payload: VerifyAadhaarOtpPayload
    ) {
        return api.post<VerifyAadhaarOtpResponse>(
            "/kyc/aadhaar/verify-otp",
            payload
        );
    }
}

const kycService = new KycService();

export default kycService;
