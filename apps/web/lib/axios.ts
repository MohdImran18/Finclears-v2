import axios from "axios";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth";

const APP_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const api = axios.create({
        baseURL: `${APP_URL.replace(/\/$/, "")}`,
        timeout: 30000,
        withCredentials: false,
        headers: {
                Accept: "application/json",
        },
});

/* ==========================================================
 | Request Interceptor
 * ========================================================== */

api.interceptors.request.use(
        (config) => {
                const token = useAuthStore.getState().token;

                if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                }

                /*
                 * IMPORTANT:
                 * Do not manually set Content-Type for FormData.
                 * Browser/Axios must generate:
                 *
                 * multipart/form-data; boundary=...
                 */
                if (typeof FormData !== "undefined" && config.data instanceof FormData) {
                        delete config.headers["Content-Type"];
                } else if (
                        config.data &&
                        typeof config.data === "object" &&
                        !(config.data instanceof FormData)
                ) {
                        config.headers["Content-Type"] = "application/json";
                }

                return config;
        },
        (error) => Promise.reject(error),
);

/* ==========================================================
 | Response Interceptor
 * ========================================================== */

api.interceptors.response.use(
        (response) => response,

        (error) => {
                if (error.response?.status === 401) {
                        useAuthStore.getState().logout();

                        if (typeof window !== "undefined") {
                                window.location.href = ROUTES.LOGIN;
                        }
                }

                return Promise.reject(error);
        },
);

export default api;
