import api from "@/lib/api";

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	name: string;
	email: string;
	phone?: string;
	password: string;
	password_confirmation: string;
}

class AuthService {
	async login(payload: LoginPayload) {
		const { data } = await api.post("/auth/login", payload);

		if (data?.data?.token) {
			localStorage.setItem("token", data.data.token);
		}

		return data;
	}

	async register(payload: RegisterPayload) {
		const { data } = await api.post("/auth/register", payload);

		if (data?.data?.token) {
			localStorage.setItem("token", data.data.token);
		}

		return data;
	}

	async me() {
		const { data } = await api.get("/auth/me");
		return data;
	}

	async logout() {
		const { data } = await api.post("/auth/logout");

		localStorage.removeItem("token");

		return data;
	}
}

export default new AuthService();
