import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { toast } from 'sonner';

/**
 * Centralized Axios client configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth tokens here if needed in the future
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Global error handling
    const message = (error.response?.data as any)?.message || error.message || 'Error de conexión';
    console.error(`[API Error] ${error.response?.status}: ${message}`);
    
    if (error.response?.status === 401) {
      toast.error('Sesión expirada');
      // Potential redirect to login
    } else if (error.response?.status === 500) {
      toast.error('Error interno del servidor');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
