import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import api from "./client";

import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/routes";

/* ==========================================================
 | Request Interceptor
 * ========================================================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();

    config.headers.Accept = "application/json";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional Request ID (future tracing)
    config.headers["X-Request-Id"] = crypto.randomUUID();

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ==========================================================
 | Response Interceptor
 * ========================================================= */

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    /*
     |------------------------------------------
     | Network Error
     |------------------------------------------
     */

    if (!error.response) {
      console.error("Network Error");

      return Promise.reject(error);
    }

    switch (error.response.status) {
      /*
       |------------------------------------------
       | Unauthorized
       |------------------------------------------
       */
      case 401: {
        const auth = useAuthStore.getState();

        auth.logout();

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== ROUTES.LOGIN
        ) {
          window.location.replace(ROUTES.LOGIN);
        }

        break;
      }

      /*
       |------------------------------------------
       | Forbidden
       |------------------------------------------
       */
      case 403:
        console.error("Forbidden");
        break;

      /*
       |------------------------------------------
       | Not Found
       |------------------------------------------
       */
      case 404:
        console.error("Resource Not Found");
        break;

      /*
       |------------------------------------------
       | Validation Error
       |------------------------------------------
       */
      case 422:
        console.error("Validation Error");
        break;

      /*
       |------------------------------------------
       | Too Many Requests
       |------------------------------------------
       */
      case 429:
        console.error("Too Many Requests");
        break;

      /*
       |------------------------------------------
       | Server Error
       |------------------------------------------
       */
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
