import { useState, useEffect } from "react";

/**
 * Props de configuración para el hook useArchitectureAnimation.
 *
 * @interface UseArchitectureAnimationProps
 * @property {number} [travelDuration=2000] - Duración en ms del viaje del paquete entre nodos.
 * @property {number} [idleDuration=1500] - Duración en ms que el paquete permanece en el nodo destino antes de continuar.
 * @property {number} [pathCount=5] - Número total de paths/rutas en el diagrama de arquitectura.
 */
interface UseArchitectureAnimationProps {
  travelDuration?: number;
  idleDuration?: number;
  pathCount?: number;
}

/**
 * Hook que gestiona la animación del diagrama de arquitectura de SofkianOS.
 *
 * Controla el movimiento de un "paquete de datos" que viaja entre nodos del diagrama
 * de arquitectura, simulando el flujo de información a través del sistema. Usa
 * requestAnimationFrame para animaciones fluidas y eficientes.
 *
 * Ciclo de animación:
 * 1. **Estado TRAVELING**: El paquete se mueve desde el nodo origen al destino
 *    - Duración: travelDuration (por defecto 2000ms)
 *    - El progreso va de 0 a 1 linealmente
 *    - Cuando progress alcanza 1, cambia a estado ARRIVED
 *
 * 2. **Estado ARRIVED**: El paquete está en el nodo destino
 *    - Duración: idleDuration (por defecto 1500ms)
 *    - El nodo destino se ilumina (efecto visual de "procesamiento")
 *    - Al finalizar, incrementa pathIndex y vuelve a TRAVELING
 *
 * 3. **Loop infinito**: Después del último path (pathIndex === pathCount-1),
 *    vuelve al path 0 creando un ciclo continuo
 *
 * Gestión de nodos activos:
 * - El nodo 0 (origen) siempre está activo
 * - Los demás nodos se activan cuando pathIndex + 1 === nodeId y status === 'ARRIVED'
 * - Esto permite que los nodos se iluminen cuando el paquete llega a ellos
 *
 * Optimizaciones:
 * - Usa requestAnimationFrame para sincronizar con el refresh rate del navegador
 * - Limpia el animation frame en cleanup para evitar memory leaks
 * - Recalcula elapsed time en cada frame para precisión temporal
 *
 * @function useArchitectureAnimation
 * @param {UseArchitectureAnimationProps} [config] - Configuración opcional del hook.
 * @param {number} [config.travelDuration=2000] - Duración del viaje en milisegundos.
 * @param {number} [config.idleDuration=1500] - Duración de espera en nodo en milisegundos.
 * @param {number} [config.pathCount=5] - Número total de paths en el diagrama.
 *
 * @returns {{
 *   pathIndex: number,
 *   status: 'TRAVELING' | 'ARRIVED',
 *   progress: number,
 *   isNodeActive: (nodeId: number) => boolean
 * }} Estado y funciones de la animación.
 *
 * @example
 * const animation = useArchitectureAnimation({ travelDuration: 2000, idleDuration: 1500, pathCount: 5 });
 * // animation.status === 'TRAVELING' durante el viaje
 * // animation.progress va de 0 a 1 mientras viaja
 * // animation.isNodeActive(nodeId) retorna true cuando el paquete llega al nodo
 */
export const useArchitectureAnimation = ({
  travelDuration = 2000,
  idleDuration = 1500,
  pathCount = 5,
}: UseArchitectureAnimationProps = {}) => {
  const [pathIndex, setPathIndex] = useState(0);
  const [status, setStatus] = useState<"TRAVELING" | "ARRIVED">("TRAVELING");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrame: number;

    const loop = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (status === "TRAVELING") {
        const p = Math.min(elapsed / travelDuration, 1);
        setProgress(p);
        if (p >= 1) {
          setStatus("ARRIVED");
          startTime = Date.now();
        }
      } else {
        if (elapsed >= idleDuration) {
          setStatus("TRAVELING");
          setPathIndex((prev) => (prev + 1) % pathCount);
          setProgress(0);
          startTime = Date.now();
        }
      }
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [pathIndex, status, travelDuration, idleDuration, pathCount]);

  const isNodeActive = (nodeId: number) => {
    if (nodeId === 0) return true;
    return pathIndex + 1 === nodeId && status === "ARRIVED";
  };

  return {
    pathIndex,
    status,
    progress,
    isNodeActive,
  };
};
