import axios from "axios";

import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/routes";

const APP_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${APP_URL.replace(/\/$/, "")}/api/v1`,
  timeout: 30000,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ==========================================================
 | Request Interceptor
 * ========================================================== */

api.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================================================
 | Response Interceptor
 * ========================================================== */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {

      useAuthStore.getState().logout();

      if (
        typeof window !== "undefined"
      ) {
        window.location.href =
          ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  }
);

export default api;