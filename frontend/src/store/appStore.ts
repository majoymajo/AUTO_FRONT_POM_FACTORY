import { create } from 'zustand';

interface AppState {
  isTransitioning: boolean;
  setTransitioning: (isTransitioning: boolean) => void;
  triggerTransition: (callback: () => void) => void;
}

/**
 * Store for global UI state and transitions.
 */
export const useAppStore = create<AppState>((set) => ({
  isTransitioning: false,
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  triggerTransition: (callback) => {
    set({ isTransitioning: true });
    setTimeout(() => {
      callback();
      set({ isTransitioning: false });
    }, 500);
  },
}));
