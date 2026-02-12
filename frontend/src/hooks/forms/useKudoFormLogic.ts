import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  KUDO_CATEGORIES,
  type KudoFormData,
} from '../../schemas/kudoFormSchema';
import { kudosService } from '../../services';
import type { AxiosError } from 'axios';

/** Shape of the error body returned by GlobalExceptionHandler. */
interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  detail: string;
}

/**
 * Hook to manage form state and submission logic.
 *
 * Validation is delegated entirely to the **backend**.
 * The frontend sends the payload as-is; if the API returns
 * 400 Bad Request, the error detail is extracted and surfaced
 * via {@link serverError} so the UI can display it inline.
 */
export const useKudoFormLogic = () => {
  const { register, watch, reset } = useForm<KudoFormData>({
    defaultValues: {
      from: '',
      to: '',
      category: undefined,
      message: '',
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const formData = watch();

  /**
   * Sends the form payload and lets the backend validate.
   * On 400, extracts the detail message and sets serverError.
   */
  const handleSend = async () => {
    setServerError(null);

    try {
      await kudosService.send(formData);
      toast.success('¡Kudo enviado! ');
      reset();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorBody>;

      if (axiosErr.response?.status === 400) {
        const detail =
          axiosErr.response.data?.detail ?? 'Solicitud inválida. Verifica los campos.';
        setServerError(detail);
        toast.error(detail);
      } else {
        toast.error('Error enviando kudo');
      }

      throw err;
    }
  };

  return {
    register,
    formData,
    serverError,
    reset,
    handleSend,
    KUDO_CATEGORIES,
  };
};
