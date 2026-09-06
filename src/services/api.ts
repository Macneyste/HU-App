/**
 * ─────────────────────────────────────────────────────────────
 *  Hormuud University — Axios API Client
 *
 *  Centralized HTTP client with JWT interceptors, error
 *  standardization, and request timeout handling.
 * ─────────────────────────────────────────────────────────────
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { platformStorage } from './platformStorage';

// ─── Base Config ──────────────────────────────────────────────

const API_BASE_URL = 'https://api.hu.edu.so/v1'; // Future production endpoint

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor — Attach JWT ─────────────────────────

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await platformStorage.getItem('hu_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor — Handle 401 & Errors ───────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Auto-retry on 401 with token refresh (one attempt)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry
    ) {
      (originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true;

      try {
        const refreshToken = await platformStorage.getItem('hu_refresh_token');
        if (refreshToken) {
          // In production: call /auth/refresh
          // const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          // await platformStorage.setItem('hu_auth_token', data.token);
          // originalRequest.headers.Authorization = `Bearer ${data.token}`;
          // return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed — force logout
        await platformStorage.removeItem('hu_auth_token');
        await platformStorage.removeItem('hu_refresh_token');
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
