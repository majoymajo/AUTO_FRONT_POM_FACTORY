import { create } from "zustand";
import type { User } from "../hooks/data/useUsers";

/**
 * Interfaz que define el estado y acciones del store de usuarios.
 *
 * @interface UserState
 * @property {User[]} users - Array de usuarios disponibles en el sistema.
 * @property {(users: User[]) => void} setUsers - Función para actualizar la lista de usuarios.
 */
interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
}

/**
 * Lista inicial de usuarios del sistema.
 * Avatares generados dinámicamente usando DiceBear API.
 *
 * @constant {User[]} INITIAL_USERS
 */
const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Christopher Pallo",
    email: "christopher@sofkianos.com",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&backgroundColor=b6e3f4",
  },
  {
    id: "2",
    name: "Santiago",
    email: "santiago@sofkianos.com",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Santiago&backgroundColor=c0aede",
  },
  {
    id: "3",
    name: "Backend Team",
    email: "backend@sofkianos.com",
    avatar:
      "https://api.dicebear.com/7.x/shapes/svg?seed=Backend&backgroundColor=d1d4f9",
  },
  {
    id: "4",
    name: "Frontend Team",
    email: "frontend@sofkianos.com",
    avatar:
      "https://api.dicebear.com/7.x/shapes/svg?seed=Frontend&backgroundColor=ffd5dc",
  },
];

/**
 * Store global Zustand para gestión de usuarios y estado de autenticación futuro.
 *
 * Centraliza la lista de usuarios disponibles en la aplicación, permitiendo
 * acceso reactivo desde cualquier componente. Diseñado para evolucionar y
 * soportar autenticación y datos de usuario dinámicos.
 *
 * Estado actual:
 * - **users**: Lista de usuarios hardcodeada con 4 usuarios iniciales
 *   - Cada usuario tiene: id, name, email, avatar (URL de DiceBear)
 *   - Avatares generados con diferentes seeds para variedad visual
 *
 * Acciones:
 *
 * 1. **setUsers(users)**:
 *    - Reemplaza completamente la lista de usuarios
 *    - Preparado para cargar usuarios desde API
 *    - Permite actualizaciones dinámicas de la lista
 *
 * Evolución futura:
 * - Cargar usuarios desde API en lugar de datos hardcodeados
 * - Agregar estado de autenticación (usuario actual logueado)
 * - Incluir roles y permisos
 * - Soportar búsqueda y filtrado de usuarios
 * - Caché de usuarios con invalidación
 *
 * Casos de uso actuales:
 * - Poblar selectores de usuarios en formularios
 * - Mostrar información de usuarios en componentes
 * - Búsqueda de usuarios por email (useAvatarPreview)
 * - Listados de usuarios disponibles
 *
 * @constant {StoreApi<UserState>} useUserStore - Hook de Zustand para acceder al store de usuarios.
 *
 * @example
 * const users = useUserStore(state => state.users);
 * const setUsers = useUserStore(state => state.setUsers);
 *
 * // Usar en un selector
 * // users.map(u => <option value={u.email}>{u.name}</option>)
 *
 * // Cargar desde API (futuro)
 * // const loadedUsers = await fetchUsers();
 * // setUsers(loadedUsers);
 */
export const useUserStore = create<UserState>((set) => ({
  users: INITIAL_USERS,
  setUsers: (users) => set({ users }),
}));
