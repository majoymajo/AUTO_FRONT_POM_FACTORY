import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormEvent, ChangeEvent } from 'react';
import { kudosSchema, type KudosFormData } from '../../schemas/kudosSchema';
import { kudosService } from '../../services';
import { useState } from 'react';

interface UseHomeFormReturn {
  inputValue: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  resetForm: () => void;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
}

export const useHomeForm = (): UseHomeFormReturn => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<KudosFormData>({
    resolver: zodResolver(kudosSchema),
    defaultValues: {
      message: '',
    },
  });

  const inputValue = watch('message');

  const onSubmit = async (data: KudosFormData) => {
    try {
      setError(null);
      setSuccessMessage(null);

      const response = await kudosService.sendKudos(data);
      
      setSuccessMessage(response.message || '¡Mensaje enviado exitosamente!');
      reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje');
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleFormSubmit(onSubmit)(e);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue('message', e.target.value, { shouldValidate: true });
  };

  const resetForm = () => {
    reset();
    setError(null);
    setSuccessMessage(null);
  };

  return {
    inputValue,
    handleInputChange,
    handleSubmit,
    resetForm,
    isSubmitting,
    error: errors.message?.message || error,
    successMessage,
  };
};
