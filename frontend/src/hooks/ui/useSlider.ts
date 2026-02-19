import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Valor inicial del slider en porcentaje.
 * @constant {number}
 */
const INITIAL_SLIDER = 0;

/**
 * Umbral en porcentaje que el slider debe superar para activar la acción.
 * @constant {number}
 */
const THRESHOLD = 90;

/**
 * Hook que gestiona la lógica de interacción de un slider de confirmación.
 *
 * Implementa un slider de "desliza para confirmar" usado en formularios críticos
 * (como envío de kudos). El usuario debe arrastrar el slider más del 90% para ejecutar
 * la acción. Incluye manejo de estados asíncronos, reset automático y recuperación de errores.
 *
 * Características principales:
 * - **Arrastre suave**: Calcula el porcentaje basado en la posición del cursor
 * - **Compensación de handle**: Resta 48px del ancho para que el handle no se salga
 * - **Umbral de activación**: Solo ejecuta onComplete si sliderValue > 90%
 * - **Operación asíncrona**: Soporta callbacks async con manejo de errores
 * - **Auto-reset**: Vuelve a 0 después de éxito (1000ms) o error (500ms)
 * - **Reset manual**: Expone resetSlider para control externo
 * - **Multi-touch**: Soporta tanto mouse como touch events
 *
 * Flujo de interacción:
 * 1. Usuario presiona el slider (handleStart): isDragging = true
 * 2. Usuario arrastra (handleMove): actualiza sliderValue según posición
 * 3. Usuario suelta (handleEnd):
 *    - Si sliderValue > 90:
 *      a. Fija sliderValue a 100
 *      b. Ejecuta onComplete (async)
 *      c. Si éxito: espera 1000ms, reset a 0
 *      d. Si error: espera 500ms (para retry rápido), reset a 0, re-lanza error
 *    - Si sliderValue <= 90: reset inmediato a 0
 *
 * Cálculo de posición:
 * - rect.left: posición absoluta del slider
 * - clientX - rect.left: posición relativa del cursor
 * - Resta 24px de offset inicial del handle
 * - Resta 48px del ancho total (ancho del handle)
 * - Divide por (rect.width - 48) para obtener porcentaje
 *
 * Event listeners globales:
 * - mousemove, mouseup, touchmove, touchend se registran en window cuando isDragging
 * - Se limpian automáticamente en el cleanup del useEffect
 * - useCallback optimiza para evitar re-renders innecesarios
 *
 * Manejo de errores:
 * - El error se re-lanza después del reset para que el componente padre pueda manejarlo
 * - Permite mostrar toasts de error sin bloquear el reset del slider
 * - Reset más rápido (500ms vs 1000ms) para permitir retry inmediato
 *
 * @function useSlider
 * @param {() => Promise<void>} [onComplete] - Callback asíncrono ejecutado al completar el deslizamiento.
 *
 * @returns {{
 *   sliderValue: number,
 *   isDragging: boolean,
 *   sliderRef: RefObject<HTMLDivElement>,
 *   handleStart: () => void,
 *   resetSlider: () => void
 * }} Estado y funciones del slider.
 *
 * @example
 * const slider = useSlider(async () => await sendKudo(formData));
 * // slider.sliderValue: porcentaje actual (0-100)
 * // slider.isDragging: true mientras el usuario arrastra
 * // slider.resetSlider(): función para resetear manualmente
 * // Aplicar sliderRef al contenedor del slider
 */
export const useSlider = (onComplete?: () => Promise<void>) => {
  const [sliderValue, setSliderValue] = useState(INITIAL_SLIDER);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback(() => setIsDragging(true), []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(clientX - rect.left - 24, rect.width - 48),
      );
      const percentage = (x / (rect.width - 48)) * 100;
      setSliderValue(percentage);
    },
    [isDragging],
  );

  const handleEnd = useCallback(async () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (sliderValue > THRESHOLD) {
      setSliderValue(100);
      try {
        if (onComplete) {
          await onComplete();
        }
        // Success reset
        setTimeout(() => setSliderValue(0), 1000);
      } catch (error) {
        // Error reset - faster to let user retry
        setTimeout(() => setSliderValue(0), 500);
        // Re-throw so the form logic can handle it (toast, etc)
        throw error;
      }
    } else {
      setSliderValue(0);
    }
  }, [isDragging, sliderValue, onComplete]);

  const resetSlider = useCallback(() => {
    setSliderValue(0);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => handleMove(e.clientX);
    const up = () => handleEnd();
    const touchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    if (isDragging) {
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      window.addEventListener("touchmove", touchMove);
      window.addEventListener("touchend", up);
    }
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", up);
    };
  }, [isDragging, handleMove, handleEnd]);

  return {
    sliderValue,
    isDragging,
    sliderRef,
    handleStart,
    resetSlider, // Exposed for external control (e.g., on error)
  };
};
