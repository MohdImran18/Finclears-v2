export interface User {
	id: number;
	name: string;
	email: string;
	phone?: string | null;
	role: string;
	status: string;
	avatar?: string | null;
	avatar_url?: string | null;
	email_verified_at?: string | null;
	last_login_at?: string | null;
	created_at?: string;
	updated_at?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	meta?: Record<string, unknown>;
}

/* ===========================
   Login
=========================== */

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse
	extends ApiResponse<{
		token: string;
		user: User;
	}> {}

/* ===========================
   Employee Consent
=========================== */

export type EmployeeConsentStatus =
        | "pending"
        | "accepted"
        | "declined"
        | "withdrawn";

export interface EmployeeConsentStatusResponse {
        success: boolean;
        data: {
                work_date: string;
                policy_version: string;
                policy_available: boolean;
                policy_text: string | null;
                retention_period: string | number | null;
                support_contact: string | null;
                status: EmployeeConsentStatus;
                accepted_at: string | null;
                withdrawn_at: string | null;
        };
}

export interface EmployeeConsentActionRequest {
        policy_version: string;
}

export interface EmployeeConsentActionResponse {
        success: boolean;
        message: string;
        data: {
                status: EmployeeConsentStatus;
                work_date?: string;
                policy_version?: string;
                withdrawn_at?: string | null;
                token: string;
                token_type: string;
        };
}
/* ===========================
   Register
=========================== */

export interface RegisterRequest {
	name: string;
	email: string;
	phone?: string;
	password: string;
	password_confirmation: string;
}

export interface RegisterResponse
	extends ApiResponse<{
		token: string;
		user: User;
	}> {}

/* ===========================
   Forgot Password
=========================== */

export interface ForgotPasswordRequest {
	email: string;
}

export interface ForgotPasswordResponse extends ApiResponse<null> {}

/* ===========================
   Reset Password
=========================== */

export interface ResetPasswordRequest {
	token: string;
	email: string;
	password: string;
	password_confirmation: string;
}

export interface ResetPasswordResponse extends ApiResponse<null> {}

/* ===========================
   Verify Email
=========================== */

export interface VerifyEmailRequest {
	id: number;
	hash: string;
}

export interface VerifyEmailResponse extends ApiResponse<null> {}

/* ===========================
   Current User
=========================== */

export interface CurrentUserResponse extends ApiResponse<User> {}
