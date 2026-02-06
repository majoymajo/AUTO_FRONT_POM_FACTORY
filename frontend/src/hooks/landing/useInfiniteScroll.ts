import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (speed: number = 0.5) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    let position = 0;
    let animationFrame: number;

    const animate = () => {
      position -= speed;

      if (trackRef.current) {
        const resetPoint = trackRef.current.scrollWidth / 2;

        if (Math.abs(position) >= resetPoint) {
          position = 0;
        }

        trackRef.current.style.transform = `translateX(${position}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [speed]);

  return { trackRef };
};
