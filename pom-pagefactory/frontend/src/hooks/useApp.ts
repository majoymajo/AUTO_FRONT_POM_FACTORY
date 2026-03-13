import { useAppStore } from "../store/appStore";

/**
 * Hook que gestiona el estado global de la aplicación.
 *
 * Proporciona acceso al estado y acciones del store global de la aplicación,
 * específicamente para manejar transiciones de navegación entre vistas.
 * Es una capa de abstracción sobre {@link useAppStore} de Zustand.
 *
 * Estado expuesto:
 * - **isTransitioning**: Indica si hay una transición de navegación en curso
 * - **triggerTransition**: Función para iniciar una transición de navegación
 *
 * Casos de uso:
 * - Coordinar animaciones de página durante navegación
 * - Mostrar loaders o estados de carga durante cambios de vista
 * - Prevenir acciones del usuario durante transiciones
 * - Sincronizar efectos visuales con cambios de ruta
 *
 * @function useApp
 * @returns {{
 *   isTransitioning: boolean,
 *   triggerTransition: (callback: () => void) => void
 * }} Objeto con el estado de transición y función para activarla.
 *
 * @example
 * ```tsx
 * import { useApp } from '../hooks/useApp';
 *
 * function NavigationButton() {
 *   const { isTransitioning, triggerTransition } = useApp();
 *
 *   const handleNavigate = () => {
 *     triggerTransition(() => {
 *       window.location.hash = '#/kudos';
 *     });
 *   };
 *
 *   return (
 *     <button disabled={isTransitioning} onClick={handleNavigate}>
 *       {isTransitioning ? 'Navegando...' : 'Ir a Kudos'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useApp = () => {
  const isTransitioning = useAppStore((state) => state.isTransitioning);
  const triggerTransition = useAppStore((state) => state.triggerTransition);

  return {
    isTransitioning,
    triggerTransition,
  };
};
