import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 30000,

  withCredentials: false,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

console.log("API Base URL:", API_BASE_URL);

export default api;
