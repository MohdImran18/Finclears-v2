import api from "./client";

import type {
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "@/types/auth";

export const AuthApi = {
    async login(payload: LoginRequest): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>(
            "/auth/login",
            payload,
        );

        return data;
    },

    async register(payload: RegisterRequest): Promise<RegisterResponse> {
        const { data } = await api.post<RegisterResponse>(
            "/auth/register",
            payload,
        );

        return data;
    },

    async me(): Promise<CurrentUserResponse> {
        const { data } = await api.get<CurrentUserResponse>(
            "/auth/me",
        );

        return data;
    },

    async logout(): Promise<void> {
        await api.post("/auth/logout");
    },
};

export default AuthApi;
