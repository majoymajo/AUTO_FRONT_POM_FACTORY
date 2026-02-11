import { useState, useCallback } from 'react';

// This hook is now simplified as most logic moved to React Router or specialized hooks.
// Keeping it for future shared transitions if needed.
export const useApp = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback((callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 500);
  }, []);

  return {
    isTransitioning,
    triggerTransition,
  };
};
