import { useState, useRef, useEffect, useCallback } from 'react';

const INITIAL_SLIDER = 0;
const THRESHOLD = 90;

/**
 * Hook to manage slider interaction logic.
 */
export const useSlider = (onComplete?: () => Promise<void>) => {
  const [sliderValue, setSliderValue] = useState(INITIAL_SLIDER);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback(() => setIsDragging(true), []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left - 24, rect.width - 48));
    const percentage = (x / (rect.width - 48)) * 100;
    setSliderValue(percentage);
  }, [isDragging]);

  const handleEnd = useCallback(async () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (sliderValue > THRESHOLD) {
      setSliderValue(100);
      if (onComplete) {
        await onComplete();
      }
      // Reset after a delay
      setTimeout(() => setSliderValue(0), 1000);
    } else {
      setSliderValue(0);
    }
  }, [isDragging, sliderValue, onComplete]);

  const resetSlider = useCallback(() => {
    setSliderValue(0);
  }, []);

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
  }, [isDragging, handleMove, handleEnd]);

  return {
    sliderValue,
    isDragging,
    sliderRef,
    handleStart,
    resetSlider,
  };
};
