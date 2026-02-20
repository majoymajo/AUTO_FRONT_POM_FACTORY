import { useEffect, useRef } from "react";

/**
 * Hook que crea un efecto de scroll horizontal infinito.
 *
 * Implementa un carrusel de scroll infinito sin saltos visuales mediante la técnica
 * de duplicación de contenido y reseteo de posición. El contenido se mueve de forma
 * continua hacia la izquierda creando la ilusión de un bucle infinito.
 *
 * Técnica de implementación:
 * 1. El contenido se duplica en el DOM (original + copia)
 * 2. El ancho total es el doble del contenido original
 * 3. Cuando el desplazamiento alcanza la mitad (scrollWidth / 2), se resetea a 0
 * 4. El reseteo es imperceptible porque el contenido duplicado es idéntico
 * 5. Se usa requestAnimationFrame para animación fluida a 60fps
 *
 * Cálculo del punto de reset:
 * - scrollWidth total = contenido original + contenido duplicado
 * - resetPoint = scrollWidth / 2 (exactamente donde termina el contenido original)
 * - Cuando |position| >= resetPoint, position vuelve a 0
 *
 * Comportamiento:
 * - El contenido se mueve continuamente sin pausas
 * - La velocidad es configurable (pixeles por frame)
 * - El movimiento es suave gracias a requestAnimationFrame
 * - No hay saltos visuales en el loop
 * - Se limpia automáticamente el animation frame al desmontar
 *
 * Rendimiento:
 * - Usa transform en lugar de left/margin para aprovechar GPU
 * - requestAnimationFrame sincroniza con el refresh rate del navegador
 * - Cleanup previene memory leaks
 *
 * @function useInfiniteScroll
 * @param {number} [speed=0.5] - Velocidad del scroll en píxeles por frame.
 *   Valores típicos: 0.3 (lento), 0.5 (medio), 1.0 (rápido).
 *
 * @returns {{
 *   trackRef: RefObject<HTMLDivElement>
 * }} Objeto con la referencia DOM que debe aplicarse al contenedor del scroll.
 *
 * @example
 * const { trackRef } = useInfiniteScroll(0.5);
 * // Aplicar trackRef al contenedor: <div ref={trackRef} className="flex w-max">
 * // El contenido debe duplicarse en el DOM para el efecto de loop infinito
 *
 * @example
 * // Velocidades diferentes:
 * const fast = useInfiniteScroll(1.2);  // Rápido
 * const slow = useInfiniteScroll(0.3);  // Lento
 */
export const useInfiniteScroll = (speed: number = 0.5) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    let position = 0;
    let animationFrame: number;

    const animate = () => {
      position -= speed;

      if (trackRef.current) {
        const resetPoint = trackRef.current.scrollWidth / 2;

        if (Math.abs(position) >= resetPoint) {
          position = 0;
        }

        trackRef.current.style.transform = `translateX(${position}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [speed]);

  return { trackRef };
};
