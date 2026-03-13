import { useUserStore } from "../../store/userStore";

/**
 * Interfaz que define la estructura de un usuario en el sistema.
 *
 * @interface User
 * @property {string} id - Identificador único del usuario.
 * @property {string} name - Nombre completo del usuario.
 * @property {string} email - Correo electrónico del usuario (usado como identificador en formularios).
 * @property {string} avatar - URL de la imagen de avatar del usuario.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

/**
 * Constante deprecada, los usuarios ahora se gestionan en userStore.
 * @deprecated Usar el hook useUsers() en su lugar.
 * @constant {User[]}
 */
export const USERS: User[] = [];

/**
 * Hook que gestiona el acceso a los datos de usuarios desde el store global.
 *
 * Proporciona acceso a la lista de usuarios disponibles en el sistema mediante
 * el store global de Zustand {@link useUserStore}. Es una capa de abstracción
 * que simplifica el acceso a los datos de usuarios desde componentes.
 *
 * Funcionalidad:
 * - Obtiene la lista de usuarios del store global reactivamente
 * - Cualquier cambio en el store de usuarios actualizará automáticamente los componentes
 * - Retorna los usuarios con el nombre "USERS" por compatibilidad con código existente
 *
 * Evolución:
 * - Anteriormente los usuarios eran una constante local exportada
 * - Ahora se gestionan centralizadamente en userStore para permitir:
 *   - Actualización dinámica de usuarios
 *   - Carga desde API
 *   - Gestión de estado global consistente
 *
 * Datos de usuario:
 * Cada usuario contiene: id, name, email y avatar (URL de imagen).
 *
 * @function useUsers
 * @returns {{
 *   USERS: User[]
 * }} Objeto con la lista de usuarios disponibles.
 *
 * @example
 * ```tsx
 * import { useUsers } from '../hooks/data/useUsers';
 *
 * function UserSelector() {
 *   const { USERS } = useUsers();
 *
 *   return (
 *     <select>
 *       {USERS.map(user => (
 *         <option key={user.id} value={user.email}>
 *           {user.name}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export const useUsers = () => {
  const users = useUserStore((state) => state.users);

  return {
    USERS: users,
  };
};
