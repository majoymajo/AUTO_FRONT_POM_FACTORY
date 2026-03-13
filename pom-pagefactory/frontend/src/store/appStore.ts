import { create } from "zustand";

/**
 * Interfaz que define el estado y acciones del store global de la aplicación.
 *
 * @interface AppState
 * @property {boolean} isTransitioning - Indica si hay una transición de navegación en curso.
 * @property {(isTransitioning: boolean) => void} setTransitioning - Setter para actualizar el estado de transición.
 * @property {(callback: () => void) => void} triggerTransition - Ejecuta una transición con callback.
 */
interface AppState {
  isTransitioning: boolean;
  setTransitioning: (isTransitioning: boolean) => void;
  triggerTransition: (callback: () => void) => void;
}

/**
 * Store global Zustand para el estado de UI y transiciones de la aplicación.
 *
 * Gestiona el estado global de transiciones de navegación entre vistas,
 * permitiendo coordinar animaciones y estados de carga durante cambios de ruta.
 *
 * Estado:
 * - **isTransitioning**: Boolean que indica si hay una transición activa
 *   - true: Durante transiciones (500ms)
 *   - false: En estado normal
 *
 * Acciones:
 *
 * 1. **setTransitioning(boolean)**:
 *    - Setter directo para actualizar el estado de transición
 *    - Útil para control manual del estado
 *
 * 2. **triggerTransition(callback)**:
 *    - Función de alto nivel que orquesta una transición completa
 *    - Flujo:
 *      a. Establece isTransitioning = true
 *      b. Espera 500ms (duración de la animación)
 *      c. Ejecuta el callback (típicamente cambio de ruta)
 *      d. Establece isTransitioning = false
 *    - Permite que las animaciones de salida se completen antes del cambio
 *
 * Casos de uso:
 * - Coordinar animaciones fade-out/fade-in entre páginas
 * - Mostrar loaders durante navegación
 * - Prevenir clics múltiples durante transiciones
 * - Sincronizar efectos visuales con cambios de ruta
 *
 * Patrón de uso:
 * 1. Componente obtiene triggerTransition del store
 * 2. En un evento (click), llama triggerTransition(() => navigate())
 * 3. El estado isTransitioning se usa para mostrar animaciones/loaders
 * 4. Después de 500ms, se ejecuta la navegación y se limpia el estado
 *
 * @constant {StoreApi<AppState>} useAppStore - Hook de Zustand para acceder al store.
 *
 * @example
 * const { isTransitioning, triggerTransition } = useAppStore();
 *
 * const handleNavigate = () => {
 *   triggerTransition(() => {
 *     window.location.hash = '#/kudos';
 *   });
 * };
 *
 * // En el render:
 * // <div className={isTransitioning ? 'fade-out' : 'fade-in'}>
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
