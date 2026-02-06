import { useState, useRef, useCallback } from 'react';

export const useApp = () => {
  const [isAppView, setIsAppView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const landingRef = useRef<HTMLDivElement>(null);

  const handleLaunchApp = useCallback(() => {
    setIsTransitioning(true);

    setTimeout(() => {
      setIsAppView((prev) => !prev);
      setIsTransitioning(false);

      if (isAppView) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 500);
  }, [isAppView]);

  const handleNavigate = useCallback((id: string) => {
    setIsAppView(false);

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  }, []);

  return {
    isAppView,
    isTransitioning,
    landingRef,
    handleLaunchApp,
    handleNavigate,
  };
};
