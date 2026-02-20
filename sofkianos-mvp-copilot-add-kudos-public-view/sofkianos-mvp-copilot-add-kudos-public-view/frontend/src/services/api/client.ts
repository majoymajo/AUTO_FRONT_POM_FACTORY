import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

import { toast } from "sonner";

/**
 * Estructura de respuesta de error devuelta por el API.
 *
 * @interface ApiErrorResponse
 * @property {string} [message] - Mensaje de error legible.
 * @property {number} [status] - Código de estado HTTP.
 * @property {string} [error] - Nombre del error.
 * @property {string} [detail] - Detalle adicional del error.
 */
interface ApiErrorResponse {
  message?: string;
  status?: number;
  error?: string;
  detail?: string;
}

/**
 * Cliente Axios centralizado para todas las peticiones HTTP de la aplicación.
 *
 * Configuración base:
 * - **baseURL**: Lee de VITE_API_URL o usa '/api' por defecto
 * - **headers**: Content-Type application/json
 * - **timeout**: 10000ms (10 segundos)
 *
 * Interceptores configurados:
 *
 * **Request Interceptor**:
 * - Actualmente pasa las peticiones sin modificar
 * - Preparado para agregar tokens de autenticación en el futuro
 * - Punto de extensión para headers personalizados
 *
 * **Response Interceptor**:
 * - **Respuestas exitosas**: Pasan sin modificar
 * - **Errores capturados**:
 *   - Extrae mensaje de error de response.data.message o usa mensaje genérico
 *   - Registra errores en consola con formato [API Error] status: message
 *   - Status 401: Muestra toast "Sesión expirada" (preparado para redirect a login)
 *   - Status 500: Muestra toast "Error interno del servidor"
 *   - Re-lanza el error para que los componentes puedan manejarlo específicamente
 *
 * Beneficios de la centralización:
 * - Configuración única aplicada a todas las peticiones
 * - Manejo de errores global consistente
 * - Fácil extensión para autenticación/autorización
 * - Logging centralizado de errores de API
 * - Notificaciones de usuario unificadas
 *
 * @constant {AxiosInstance} apiClient - Instancia configurada de Axios.
 *
 * @example
 * import { apiClient } from './services/api/client';
 *
 * // GET request
 * const response = await apiClient.get('/v1/kudos');
 *
 * // POST request
 * await apiClient.post('/v1/kudos', { from: 'user@email.com', to: 'other@email.com' });
 *
 * // Errores se manejan automáticamente (toasts) pero también se pueden capturar
 * try {
 *   await apiClient.post('/v1/kudos', data);
 * } catch (error) {
 *   // Error ya fue mostrado en toast, aquí manejamos lógica específica
 * }
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
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
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Global error handling
    const message =
      (error.response?.data as ApiErrorResponse)?.message ||
      error.message ||
      "Error de conexión";
    console.error(`[API Error] ${error.response?.status}: ${message}`);

    if (error.response?.status === 401) {
      toast.error("Sesión expirada");
      // Potential redirect to login
    } else if (error.response?.status === 500) {
      toast.error("Error interno del servidor");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
