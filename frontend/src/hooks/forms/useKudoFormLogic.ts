import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  KUDO_CATEGORIES,
  type KudoFormData,
} from '../../schemas/kudoFormSchema';
import { kudosService } from '../../services';
import type { AxiosError } from 'axios';
import { parseAndTranslateErrors, type ValidationError } from '../../utils/errorMapper';

/** Shape of the error body returned by GlobalExceptionHandler. */
interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  detail: string;
}

/**
 * Hook to manage form state and submission logic.
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

  // Changed from string to ValidationError[]
  const [serverErrors, setServerErrors] = useState<ValidationError[]>([]);

  const formData = watch();

  const handleSend = async () => {
    setServerErrors([]);

    try {
      await kudosService.send(formData);
      toast.success('¡Kudo enviado! ');
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
        toast.error('Error enviando kudo. Por favor intenta de nuevo.');
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
