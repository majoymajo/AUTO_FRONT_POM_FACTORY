import { useUsers } from '../data/useUsers';
import { useSlider } from '../ui/useSlider';
import { useAvatarPreview } from '../ui/useAvatarPreview';
import { useKudoFormLogic } from './useKudoFormLogic';

/**
 * Orchestrator hook that composes specialized hooks for the KudoForm.
 * This refactoring ensures No UI logic is present in the main hook logic,
 * and data handling is decoupled.
 */
export const useKudoForm = () => {
  const { USERS } = useUsers();
  const { register, formData, serverErrors, handleSend, KUDO_CATEGORIES } = useKudoFormLogic();
  const { toUser, loadingAvatar } = useAvatarPreview(formData.to);
  const { sliderValue, isDragging, sliderRef, handleStart } = useSlider(handleSend);

  return {
    // Data
    USERS,
    KUDO_CATEGORIES,

    // Form state/actions
    register,
    serverErrors,
    formData,
    toUser,
    loadingAvatar,

    // Interaction state/actions
    sliderValue,
    isDragging,
    sliderRef,
    handleStart,
  };
};
