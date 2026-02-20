import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

/**
 * Props del componente ErrorBoundary.
 *
 * @interface Props
 * @property {ReactNode} children - Componentes hijos que serán protegidos por el boundary.
 * @property {ReactNode | ((error: Error, resetError: () => void) => ReactNode)} fallback - UI a mostrar cuando ocurra un error. Puede ser un ReactNode estático o función que recibe el error y función de reset.
 * @property {(error: Error, errorInfo: ErrorInfo) => void} [onCatch] - Callback opcional para manejar errores capturados (ej: logging, analytics).
 */
interface Props {
  children: ReactNode;
  fallback: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onCatch?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Estado interno del componente ErrorBoundary.
 *
 * @interface State
 * @property {boolean} hasError - Indica si se ha capturado un error en el árbol de componentes.
 * @property {Error | null} error - Instancia del error capturado, o null si no hay error.
 */
interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary estándar de React (Componente de Clase).
 *
 * Captura errores de JavaScript en cualquier lugar del árbol de componentes hijo,
 * registra esos errores y muestra una UI de respaldo (fallback) en lugar de que
 * toda la aplicación se rompa. Funciona como un try/catch declarativo para componentes.
 *
 * Los Error Boundaries capturan errores durante:
 * - El renderizado
 * - En métodos de ciclo de vida
 * - En constructores de todo el árbol debajo de ellos
 *
 * NO capturan errores en:
 * - Event handlers (usar try/catch manual)
 * - Código asíncrono (setTimeout, promises)
 * - Server-side rendering
 * - Errores lanzados en el propio Error Boundary
 *
 * @class ErrorBoundary
 * @extends {Component<Props, State>}
 *
 * @example
 * ```tsx
 * // Uso básico con fallback estático
 * <ErrorBoundary fallback={<div>Algo salió mal</div>}>
 *   <MiComponente />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // Uso con fallback dinámico y reset
 * <ErrorBoundary
 *   fallback={(error, resetError) => (
 *     <div>
 *       <h2>Error: {error.message}</h2>
 *       <button onClick={resetError}>Reintentar</button>
 *     </div>
 *   )}
 *   onCatch={(error, errorInfo) => {
 *     console.error('Error capturado:', error, errorInfo);
 *     // Enviar a servicio de logging
 *   }}
 * >
 *   <MiComponente />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
  /**
   * Crea una instancia de ErrorBoundary.
   *
   * @param {Props} props - Props del componente.
   * @param {ReactNode} props.children - Componentes hijos a proteger.
   * @param {ReactNode | Function} props.fallback - UI de respaldo en caso de error.
   * @param {Function} [props.onCatch] - Callback opcional para errores capturados.
   */
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Método estático de ciclo de vida de React.
   * Actualiza el estado cuando se captura un error en el árbol de componentes.
   *
   * Este método es llamado durante la fase de renderizado, por lo que no debe
   * contener efectos secundarios. Para logging usar componentDidCatch.
   *
   * @static
   * @param {Error} error - Error capturado en el árbol de componentes hijo.
   * @returns {State} Nuevo estado indicando que hay error y guardando la instancia.
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Método de ciclo de vida invocado después de que un error ha sido capturado.
   * Permite registrar errores, enviarlos a servicios de logging o analytics.
   *
   * Este método es llamado durante la fase de commit, por lo que puede contener
   * efectos secundarios como llamadas a APIs de logging.
   *
   * @param {Error} error - El error que fue lanzado.
   * @param {ErrorInfo} errorInfo - Información adicional sobre el error, incluye componentStack.
   * @returns {void}
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }

  /**
   * Reinicia el estado de error del boundary.
   * Permite volver a renderizar los componentes hijos después de un error.
   *
   * Esta función se puede pasar al fallback para que el usuario pueda
   * intentar recuperarse del error (ej: botón "Reintentar").
   *
   * @returns {void}
   */
  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Método de renderizado de React.
   *
   * Si hay un error capturado, renderiza el fallback (estático o función).
   * Si no hay error, renderiza los componentes hijos normalmente.
   *
   * @returns {ReactNode} El fallback si hay error, o los children si no hay error.
   */
  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.resetError);
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
