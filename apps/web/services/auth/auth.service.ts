import API from "@/constants/api";
import { get, post } from "@/lib/request";

import type {
	CurrentUserResponse,
	EmployeeConsentActionRequest,
	EmployeeConsentActionResponse,
	EmployeeConsentStatusResponse,
	ForgotPasswordRequest,
	ForgotPasswordResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	User,
	VerifyEmailResponse,
} from "@/types/auth";

export const AuthService = {
	/**
	 * Login
	 */
	login(data: LoginRequest) {
		return post<LoginResponse>(API.AUTH.LOGIN, data);
	},
        /**
         * Employee Daily Consent Status
         */
        employeeConsentStatus() {
                return get<EmployeeConsentStatusResponse>(
                        API.AUTH.EMPLOYEE_CONSENT_STATUS
                );
        },

        /**
         * Accept Employee Daily Consent
         */
        acceptEmployeeConsent(data: EmployeeConsentActionRequest) {
                return post<EmployeeConsentActionResponse>(
                        API.AUTH.EMPLOYEE_CONSENT_ACCEPT,
                        data
                );
        },

        /**
         * Decline Employee Daily Consent
         */
        declineEmployeeConsent(data: EmployeeConsentActionRequest) {
                return post<EmployeeConsentActionResponse>(
                        API.AUTH.EMPLOYEE_CONSENT_DECLINE,
                        data
                );
        },

        /**
         * Withdraw Employee Daily Consent
         */
        withdrawEmployeeConsent(data: EmployeeConsentActionRequest) {
                return post<EmployeeConsentActionResponse>(
                        API.AUTH.EMPLOYEE_CONSENT_WITHDRAW,
                        data
                );
        },

	/**
	 * Register
	 */
	register(data: RegisterRequest) {
		return post<RegisterResponse>(API.AUTH.REGISTER, data);
	},

	/**
	 * Current User
	 */
	me() {
		return get<CurrentUserResponse>(API.AUTH.ME);
	},

	/**
	 * Logout
	 */
	logout() {
		return post<void>(API.AUTH.LOGOUT);
	},

	/**
	 * Forgot Password
	 */
	forgotPassword(data: ForgotPasswordRequest) {
		return post<ForgotPasswordResponse>(API.AUTH.FORGOT_PASSWORD, data);
	},

	/**
	 * Reset Password
	 */
	resetPassword(data: ResetPasswordRequest) {
		return post<ResetPasswordResponse>(API.AUTH.RESET_PASSWORD, data);
	},

	/**
	 * Verify Email
	 */
	verifyEmail(token: string) {
		return get<VerifyEmailResponse>(`${API.AUTH.VERIFY_EMAIL}/${token}`);
	},

	/**
	 * Resend Verification Email
	 *
	 * Enable this only after creating the
	 * backend route and API constant.
	 */
	/*
  resendVerification() {
    return post<void>(
      API.AUTH.RESEND_VERIFICATION
    );
  },
  */
};

export default AuthService;
