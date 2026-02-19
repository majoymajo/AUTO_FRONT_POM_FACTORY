import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  KUDO_CATEGORIES,
  type KudoFormData,
} from "../../schemas/kudoFormSchema";
import { kudosService } from "../../services";
import type { AxiosError } from "axios";
import {
  parseAndTranslateErrors,
  type ValidationError,
} from "../../utils/errorMapper";

/**
 * Estructura del cuerpo de error devuelto por GlobalExceptionHandler del backend.
 *
 * @interface ApiErrorBody
 * @property {string} timestamp - Timestamp ISO del momento del error.
 * @property {number} status - Código de estado HTTP (ej: 400, 500).
 * @property {string} error - Nombre del error (ej: "Bad Request").
 * @property {string} detail - Detalles del error, puede contener errores de validación serializados.
 */
interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  detail: string;
}

/**
 * Hook que gestiona el estado del formulario de kudos y la lógica de envío.
 *
 * Maneja todo el ciclo de vida del formulario: estado de campos, validación del servidor,
 * envío asíncrono a la API, manejo de errores y notificaciones al usuario. Usa react-hook-form
 * para la gestión de estado del formulario y sonner para las notificaciones toast.
 *
 * Responsabilidades:
 * - **Estado del formulario**: Campos from, to, category, message con valores por defecto
 * - **Validación del servidor**: Captura errores 400 y parsea los detalles de validación
 * - **Envío a la API**: Llama a {@link kudosService.send} con los datos del formulario
 * - **Manejo de errores**: Parsea errores del backend usando {@link parseAndTranslateErrors}
 * - **Notificaciones**: Muestra toasts de éxito o error según el resultado
 * - **Reset**: Limpia el formulario después de un envío exitoso
 *
 * Flujo de envío:
 * 1. Usuario completa el slider que ejecuta handleSend
 * 2. Se limpian errores previos del servidor
 * 3. Se llama a kudosService.send(formData)
 * 4. En éxito: toast de éxito + reset del formulario
 * 5. En error 400: parsea el campo "detail" para extraer errores de validación
 * 6. En otros errores: toast genérico de error
 *
 * Gestión de errores de validación:
 * - Los errores del servidor se parsean de JSON a array de ValidationError
 * - Cada error tiene: field (nombre del campo) y message (mensaje traducido)
 * - Se traduce automáticamente usando errorMapper para mostrar en español
 *
 * @function useKudoFormLogic
 * @returns {{
 *   register: UseFormRegister<KudoFormData>,
 *   formData: KudoFormData,
 *   serverErrors: ValidationError[],
 *   reset: () => void,
 *   handleSend: () => Promise<void>,
 *   KUDO_CATEGORIES: string[]
 * }} Objeto con funciones y estado del formulario.
 *
 * @example
 * ```tsx
 * import { useKudoFormLogic } from '../hooks/forms/useKudoFormLogic';
 *
 * function KudoForm() {
 *   const {
 *     register,
 *     formData,
 *     serverErrors,
 *     handleSend,
 *     KUDO_CATEGORIES
 *   } = useKudoFormLogic();
 *
 *   return (
 *     <form>
 *       <input {...register('from')} />
 *       <select {...register('category')}>
 *         {KUDO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
 *       </select>
 *       {serverErrors.map(err => (
 *         <p key={err.field}>{err.field}: {err.message}</p>
 *       ))}
 *       <button onClick={handleSend}>Enviar</button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useKudoFormLogic = () => {
  const { register, watch, reset } = useForm<KudoFormData>({
    defaultValues: {
      from: "",
      to: "",
      category: undefined,
      message: "",
    },
  });

  // Changed from string to ValidationError[]
  const [serverErrors, setServerErrors] = useState<ValidationError[]>([]);

  const formData = watch();

  const handleSend = async () => {
    setServerErrors([]);

    try {
      await kudosService.send(formData);
      toast.success("¡Kudo enviado! ");
      reset();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorBody>;

      if (axiosErr.response?.status === 400) {
        const detail = axiosErr.response.data?.detail;
        const parsedErrors = parseAndTranslateErrors(detail);
        setServerErrors(parsedErrors);

        // Toast shows summary
        toast.error(`Tienes ${parsedErrors.length} errores en el formulario.`);
      } else {
        toast.error("Error enviando kudo. Por favor intenta de nuevo.");
      }

      throw err;
    }
  };

  return {
    register,
    formData,
    serverErrors, // Renamed for clarity
    reset,
    handleSend,
    KUDO_CATEGORIES,
  };
};
