import axios from "axios";

export const API_BASE_URL_STORAGE_KEY = "api_base_url";
export const API_BASE_URL_DEFAULT =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5050";

export function getApiBaseUrl(): string {
  return localStorage.getItem(API_BASE_URL_STORAGE_KEY) || API_BASE_URL_DEFAULT;
}

const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Api error:", error);
    return Promise.reject(error);
  },
);

export default api;