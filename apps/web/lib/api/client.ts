import axios from "axios";

/* ==========================================================
 | API Base URL
 * ========================================================= */

const APP_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

const API_BASE_URL =
  `${APP_URL.replace(/\/$/, "")}/api`;

/* ==========================================================
 | Axios Instance
 * ========================================================= */

const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 30000,

  withCredentials: false,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

/* ==========================================================
 | Development Logger
 * ========================================================= */

if (process.env.NODE_ENV === "development") {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 FinClears API");
  console.log("Base URL:", API_BASE_URL);
  console.log("Environment:", process.env.NODE_ENV);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

export default api;