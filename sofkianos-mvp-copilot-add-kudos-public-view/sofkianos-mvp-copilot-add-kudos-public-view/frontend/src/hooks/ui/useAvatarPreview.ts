import { useState, useEffect, useMemo } from "react";
import { USERS } from "../data/useUsers";
import type { User } from "../data/useUsers";

/**
 * Hook que gestiona la previsualización del avatar del usuario seleccionado.
 *
 * Busca el usuario en la lista global USERS basándose en el email seleccionado y
 * gestiona un estado de carga simulado para mejorar la experiencia visual. Muestra
 * un estado de "loading" temporal cuando cambia la selección del usuario.
 *
 * Funcionalidad:
 * - **Búsqueda reactiva**: Usa useMemo para buscar el usuario en USERS cuando cambia el email
 * - **Estado de carga simulado**: Muestra loading durante 800ms cuando se selecciona un nuevo usuario
 * - **Optimización**: useMemo evita búsquedas innecesarias si el email no cambia
 * - **Limpieza automática**: clearTimeout previene memory leaks si el componente se desmonta
 *
 * Flujo de carga:
 * 1. Usuario selecciona un email en el formulario
 * 2. useMemo encuentra el objeto User correspondiente
 * 3. Si existe usuario: loadingAvatar = true durante 800ms
 * 4. Si no existe usuario: loadingAvatar = false inmediatamente
 * 5. Después de 800ms: loadingAvatar = false, muestra el avatar
 *
 * Estados:
 * - **toUser null, loading false**: No hay selección, muestra placeholder
 * - **toUser null, loading true**: (no ocurre, se previene con early return)
 * - **toUser existe, loading true**: Muestra skeleton/spinner del avatar
 * - **toUser existe, loading false**: Muestra el avatar real del usuario
 *
 * Casos de uso:
 * - Formularios de kudos para previsualizar al destinatario
 * - Selectores de usuarios con avatar
 * - Mejora de UX al cambiar entre usuarios rápidamente
 *
 * @function useAvatarPreview
 * @param {string} selectedEmail - Email del usuario seleccionado en el formulario.
 *
 * @returns {{
 *   toUser: User | undefined,
 *   loadingAvatar: boolean
 * }} Objeto con el usuario encontrado y estado de carga.
 *
 * @example
 * const { toUser, loadingAvatar } = useAvatarPreview(formData.to);
 * // toUser: objeto User si existe, undefined si no
 * // loadingAvatar: true durante 800ms al cambiar selección
 * // Renderizar: skeleton si loading, avatar real si toUser && !loading
 */
export const useAvatarPreview = (selectedEmail: string) => {
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const toUser = useMemo(
    () => USERS.find((u: User) => u.email === selectedEmail),
    [selectedEmail],
  );

  useEffect(() => {
    if (!toUser) {
      setLoadingAvatar(false);
      return;
    }

    setLoadingAvatar(true);
    const t = setTimeout(() => setLoadingAvatar(false), 800);
    return () => clearTimeout(t);
  }, [selectedEmail, toUser]);

  return {
    toUser,
    loadingAvatar,
  };
};
