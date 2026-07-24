import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import api from "./client";

import { ROUTES } from "@/constants/routes";

/* ==========================================================
 | Request Interceptor
 * ========================================================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Accept = "application/json";

    // Client-side only
    if (typeof window !== "undefined") {
      const { useAuthStore } = require("@/store/auth");

      const { token } = useAuthStore.getState();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (typeof crypto !== "undefined") {
      config.headers["X-Request-Id"] =
        crypto.randomUUID();
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        "API REQUEST:",
        `${config.baseURL}${config.url}`
      );
    }

    return config;
  },

  (error: AxiosError) =>
    Promise.reject(error)
);

/* ==========================================================
 | Response Interceptor
 * ========================================================= */

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "API SUCCESS:",
        response.config.url,
        response.status
      );
    }

    return response;
  },

  async (error: AxiosError) => {
    if (!error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Network Error:",
          error.message
        );
      }

      return Promise.reject(error);
    }

    if (process.env.NODE_ENV === "development") {
      console.error(
        "API ERROR:",
        `${error.config?.baseURL}${error.config?.url}`,
        error.response.status
      );
    }

    switch (error.response.status) {
      case 401: {
        // Client-side logout only
        if (typeof window !== "undefined") {
          const { useAuthStore } = require("@/store/auth");

          useAuthStore.getState().logout();

          if (
            window.location.pathname !==
            ROUTES.LOGIN
          ) {
            window.location.replace(
              ROUTES.LOGIN
            );
          }
        }

        break;
      }

      case 403:
        console.error("Forbidden");
        break;

      case 404:
        console.error("Resource Not Found");
        break;

      case 422:
        console.error("Validation Error");
        break;

      case 429:
        console.error("Too Many Requests");
        break;

      case 500:
        console.error("Internal Server Error");
        break;

      default:
        console.error("Unexpected API Error");
    }

    return Promise.reject(error);
  }
);

export default api;