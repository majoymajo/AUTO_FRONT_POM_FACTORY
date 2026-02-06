import { useState, useRef, useEffect } from 'react';

interface UseLaunchSliderProps {
  initialSliderValue: number;
  onLaunch?: () => void;
}

export const useLaunchSlider = ({ initialSliderValue, onLaunch }: UseLaunchSliderProps) => {
  const [sliderValue, setSliderValue] = useState(initialSliderValue);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (!completed) setIsDragging(true);
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (sliderValue > 90) {
      setCompleted(true);
      setSliderValue(100);

      setTimeout(() => {
        onLaunch?.();
        setSliderValue(initialSliderValue);
        setCompleted(false);
      }, 400);
    } else {
      setSliderValue(initialSliderValue);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    setSliderValue(percent);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleMove(e.clientX);
    const onUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, sliderValue]);

  return {
    sliderValue,
    isDragging,
    completed,
    sliderRef,
    handleStart,
    handleMove,
    handleEnd,
  };
};
