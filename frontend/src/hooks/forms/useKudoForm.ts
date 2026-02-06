import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  kudoFormSchema,
  KUDO_CATEGORIES,
  type KudoFormData,
} from '../../schemas/kudoFormSchema';
import { sendKudo } from '../../api/kudosApi';

export const USERS = [
  { id: '1', name: 'Christopher Pallo', email: 'christopher@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&backgroundColor=b6e3f4' },
  { id: '2', name: 'Santiago', email: 'santiago@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Santiago&backgroundColor=c0aede' },
  { id: '3', name: 'Backend Team', email: 'backend@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Backend&backgroundColor=d1d4f9' },
  { id: '4', name: 'Frontend Team', email: 'frontend@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Frontend&backgroundColor=ffd5dc' },
];

const INITIAL_SLIDER = 0;

export const useKudoForm = () => {
  const [sliderValue, setSliderValue] = useState(INITIAL_SLIDER);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { register, watch, reset } = useForm<KudoFormData>({
    resolver: zodResolver(kudoFormSchema),
  });

  const formData = watch();
  const toEmail = formData.to;
  const toUser = USERS.find((u) => u.email === toEmail);

  useEffect(() => {
    if (!toUser) return;
    setLoadingAvatar(true);

    const t = setTimeout(() => setLoadingAvatar(false), 1000);
    return () => clearTimeout(t);
  }, [toEmail]);

  const handleStart = () => setIsDragging(true);

  const handleMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left - 24, rect.width - 48));
    const percentage = (x / (rect.width - 48)) * 100;
    setSliderValue(percentage);
  };

  const handleEnd = async () => {
    setIsDragging(false);
    if (sliderValue > 90) {
      setSliderValue(100);
      try {
        await sendKudo(formData);
        toast.success('¡Kudo enviado! ');
        reset();
      } catch {
        toast.error('Error enviando');
      } finally {
        setTimeout(() => setSliderValue(0), 1000);
      }
    } else {
      setSliderValue(0);
    }
  };

  useEffect(() => {
    const move = (e: MouseEvent) => handleMove(e.clientX);
    const up = () => handleEnd();
    const touchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    if (isDragging) {
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
      window.addEventListener('touchmove', touchMove);
      window.addEventListener('touchend', up);
    }
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', up);
    };
  }, [isDragging, sliderValue]);

  return {
    sliderValue,
    isDragging,
    loadingAvatar,
    sliderRef,
    register,
    toUser,
    USERS,
    KUDO_CATEGORIES,
    handleStart,
  };
};
