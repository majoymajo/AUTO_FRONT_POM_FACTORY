import { useUsers } from "../data/useUsers";
import { useSlider } from "../ui/useSlider";
import { useAvatarPreview } from "../ui/useAvatarPreview";
import { useKudoFormLogic } from "./useKudoFormLogic";

/**
 * Hook orquestador que compone hooks especializados para el formulario de Kudos.
 *
 * Este hook implementa el patrón de composición de hooks para mantener separación de
 * responsabilidades y evitar mezclar lógica de UI con lógica de negocio. Actúa como
 * una "facade" que integra cuatro hooks especializados en una API unificada.
 *
 * Hooks compuestos:
 * 1. {@link useUsers} - Proporciona la lista de usuarios disponibles del store global
 * 2. {@link useKudoFormLogic} - Maneja estado del formulario, validación y envío a la API
 * 3. {@link useAvatarPreview} - Gestiona la carga y previsualización del avatar del destinatario
 * 4. {@link useSlider} - Controla el comportamiento del slider de envío interactivo
 *
 * Beneficios del patrón de composición:
 * - **Separación de responsabilidades**: Cada hook gestiona un aspecto específico del formulario
 * - **Reutilización**: Los hooks especializados pueden usarse independientemente en otros contextos
 * - **Testabilidad**: Cada hook puede probarse de forma aislada sin dependencias complejas
 * - **Mantenibilidad**: Cambios en una funcionalidad no afectan a las demás
 * - **Legibilidad**: El código del componente consumidor es más limpio y declarativo
 *
 * Datos expuestos:
 * - USERS: Array de usuarios disponibles para seleccionar como remitente/destinatario
 * - KUDO_CATEGORIES: Categorías de kudos disponibles (ej: "Colaboración", "Innovación")
 * - formData: Estado actual del formulario con campos (from, to, category, message)
 * - toUser: Objeto completo del usuario destinatario seleccionado (incluye avatar URL)
 * - loadingAvatar: Booleano indicando si el avatar del destinatario está cargando
 * - serverErrors: Array de errores de validación retornados por el servidor
 *
 * Interacción del usuario:
 * - register: Función para registrar campos del formulario (de react-hook-form)
 * - sliderValue: Valor actual del slider de envío (0-100)
 * - isDragging: Booleano indicando si el usuario está arrastrando activamente el slider
 * - sliderRef: Referencia DOM del elemento slider para manejar eventos
 * - handleStart: Handler para iniciar el arrastre del slider (mouse/touch)
 *
 * @function useKudoForm
 * @returns {{
 *   USERS: User[],
 *   KUDO_CATEGORIES: string[],
 *   register: UseFormRegister<KudoFormData>,
 *   serverErrors: ValidationError[],
 *   formData: KudoFormData,
 *   toUser: User | null,
 *   loadingAvatar: boolean,
 *   sliderValue: number,
 *   isDragging: boolean,
 *   sliderRef: RefObject<HTMLDivElement>,
 *   handleStart: (e: React.MouseEvent | React.TouchEvent) => void
 * }} Objeto con todos los datos y acciones necesarios para renderizar el formulario de kudos.
 *
 * @example
 * const kudoFormData = useKudoForm();
 * // Retorna: { USERS, KUDO_CATEGORIES, register, formData, toUser, loadingAvatar,
 * //           serverErrors, sliderValue, isDragging, sliderRef, handleStart }
 */
export const useKudoForm = () => {
  const { USERS } = useUsers();
  const { register, formData, serverErrors, handleSend, KUDO_CATEGORIES } =
    useKudoFormLogic();
  const { toUser, loadingAvatar } = useAvatarPreview(formData.to);
  const { sliderValue, isDragging, sliderRef, handleStart } =
    useSlider(handleSend);

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
