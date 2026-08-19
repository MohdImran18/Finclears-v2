import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export function me() {
  return api.get("/auth/me");
}

export function login(data: LoginRequest) {
  return api.post("/auth/login", data);
}

export function register(data: RegisterRequest) {
  return api.post("/auth/register", data);
}

export function logout() {
  return api.post("/auth/logout");
}

