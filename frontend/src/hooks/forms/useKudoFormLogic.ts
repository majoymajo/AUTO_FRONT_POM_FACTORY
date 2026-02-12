import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  kudoFormSchema,
  KUDO_CATEGORIES,
  type KudoFormData,
} from '../../schemas/kudoFormSchema';
import { kudosService } from '../../services';

/**
 * Hook to manage form state and submission logic.
 */
export const useKudoFormLogic = () => {
  const { register, watch, reset } = useForm<KudoFormData>({
    resolver: zodResolver(kudoFormSchema),
    defaultValues: {
      from: '',
      to: '',
      category: undefined,
      message: ''
    }
  });


  const formData = watch();

  const handleSend = async () => {
    try {
      // Validate before sending? 
      // slider logic relies on this being called ONLY when threshold met.
      await kudosService.send(formData);
      toast.success('¡Kudo enviado! ');
      reset();
    } catch (error) {
      toast.error('Error enviando kudo');
      throw error; // Re-throw to allow useSlider to handle failure if needed
    }
  };

  return {
    register,
    formData,
    reset,
    handleSend,
    KUDO_CATEGORIES,
  };
};
