import { useAppStore } from '../store/appStore';

/**
 * Hook to consume global app state.
 */
export const useApp = () => {
  const isTransitioning = useAppStore((state) => state.isTransitioning);
  const triggerTransition = useAppStore((state) => state.triggerTransition);

  return {
    isTransitioning,
    triggerTransition,
  };
};
