import axios from "axios";

import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/routes";

const axiosClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000/api",

  timeout: 30000,

  withCredentials: false,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

axiosClient.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {

    const status =
      error.response?.status;

    const url =
      error.config?.url ?? "";

    const protectedRoutes = [
      "/v1/auth/me",
      "/v1/auth/logout",
      "/v1/users",
      "/v1/orders",
      "/v1/payments",
      "/v1/documents",
      "/v1/companies",
      "/v1/leads",
      "/v1/notifications",
    ];

    const isProtectedRequest =
      protectedRoutes.some((route) =>
        url.includes(route)
      );

    /*
    |--------------------------------------------------------------------------
    | Logout only for authenticated APIs
    |--------------------------------------------------------------------------
    */

    if (
      status === 401 &&
      isProtectedRequest
    ) {
      useAuthStore
        .getState()
        .logout();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !==
          ROUTES.LOGIN
      ) {
        window.location.replace(
          ROUTES.LOGIN
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Development Logger
    |--------------------------------------------------------------------------
    */

    if (
      process.env.NODE_ENV ===
      "development"
    ) {
      console.group(
        "🚨 API ERROR"
      );

      console.log(
        "URL:",
        url
      );

      console.log(
        "Status:",
        status
      );

      console.log(
        "Request:",
        error.config?.data
      );

      console.log(
        "Response:",
        error.response?.data
      );

      console.groupEnd();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;