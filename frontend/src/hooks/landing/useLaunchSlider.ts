import { useState, useRef, useEffect } from "react";

/**
 * Props de configuración para el hook useLaunchSlider.
 *
 * @interface UseLaunchSliderProps
 * @property {number} initialSliderValue - Valor inicial del slider en porcentaje (0-100).
 * @property {() => void} [onLaunch] - Callback ejecutado cuando el slider alcanza el umbral de lanzamiento (>90%).
 */
interface UseLaunchSliderProps {
  initialSliderValue: number;
  onLaunch?: () => void;
}

/**
 * Hook que gestiona la interacción de un slider de lanzamiento para la landing page.
 *
 * Implementa un slider de confirmación tipo "desliza para lanzar" usado en el hero de la
 * landing page. El usuario debe arrastrar el slider más del 90% para activar la acción de
 * lanzamiento. Incluye animaciones suaves y estados visuales de completitud.
 *
 * Funcionalidad:
 * - **Arrastre (Drag)**: El usuario puede arrastrar el slider con mouse o touch
 * - **Umbral de activación**: Solo se activa si el slider supera el 90%
 * - **Estado completado**: Cuando se alcanza el umbral, marca como completado
 * - **Animación de confirmación**: Al completar, fija el slider al 100% brevemente
 * - **Auto-reset**: Después de ejecutar onLaunch, vuelve al valor inicial en 400ms
 * - **Reset manual**: Si no alcanza el umbral, vuelve al valor inicial inmediatamente
 *
 * Ciclo de vida del slider:
 * 1. Usuario presiona (handleStart): isDragging = true
 * 2. Usuario mueve (handleMove): actualiza sliderValue basado en posición del mouse/touch
 * 3. Usuario suelta (handleEnd):
 *    - Si sliderValue > 90: completed = true, fija a 100%, ejecuta onLaunch, espera 400ms, reset
 *    - Si sliderValue <= 90: reset inmediato al valor inicial
 *
 * Cálculo de porcentaje:
 * - Lee el boundingClientRect del contenedor slider
 * - Calcula la posición relativa del cursor dentro del contenedor
 * - Convierte a porcentaje (0-100) asegurando límites con Math.max/Math.min
 *
 * Event listeners:
 * - Registra mousemove y mouseup globalmente cuando isDragging es true
 * - Limpia los listeners automáticamente en el cleanup del useEffect
 * - Soporta tanto mouse como touch events
 *
 * @function useLaunchSlider
 * @param {UseLaunchSliderProps} config - Configuración del slider.
 * @param {number} config.initialSliderValue - Valor inicial del slider (típicamente 10-15%).
 * @param {() => void} [config.onLaunch] - Callback al completar el deslizamiento.
 *
 * @returns {{
 *   sliderValue: number,
 *   isDragging: boolean,
 *   completed: boolean,
 *   sliderRef: RefObject<HTMLDivElement>,
 *   handleStart: () => void,
 *   handleMove: (clientX: number) => void,
 *   handleEnd: () => void
 * }} Estado y funciones del slider de lanzamiento.
 *
 * @example
 * const slider = useLaunchSlider({ initialSliderValue: 11, onLaunch: handleLaunchApp });
 * // slider.sliderValue: porcentaje actual (0-100)
 * // slider.isDragging: true mientras el usuario arrastra
 * // slider.completed: true cuando se alcanza el umbral
 * // Aplicar sliderRef al elemento contenedor del slider
 */
export const useLaunchSlider = ({
  initialSliderValue,
  onLaunch,
}: UseLaunchSliderProps) => {
  const [sliderValue, setSliderValue] = useState(initialSliderValue);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (!completed) setIsDragging(true);
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (sliderValue > 90) {
      setCompleted(true);
      setSliderValue(100);

      setTimeout(() => {
        onLaunch?.();
        setSliderValue(initialSliderValue);
        setCompleted(false);
      }, 400);
    } else {
      setSliderValue(initialSliderValue);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    setSliderValue(percent);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleMove(e.clientX);
    const onUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, sliderValue]);

  return {
    sliderValue,
    isDragging,
    completed,
    sliderRef,
    handleStart,
    handleMove,
    handleEnd,
  };
};
