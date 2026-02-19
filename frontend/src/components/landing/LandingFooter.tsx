import React from "react";

/**
 * Componente Footer de la landing page.
 *
 * Renderiza el pie de página de la landing page de SofkianOS con información
 * sobre el equipo de desarrollo y descripción técnica del proyecto.
 *
 * Contenido:
 * - **Primera línea**: Nombres del equipo de desarrollo
 *   - "Equipo Sofkianos · Christopher Pallo · Elian Condor · Leonel · Hans Ortiz · Jean Pierre"
 * - **Segunda línea**: Descripción técnica del taller/proyecto
 *   - "Taller: Sistema Distribuido — Arquitectura de Microservicios | Comunicación Asíncrona | Metodología AI-First"
 *
 * Estilo visual:
 * - Borde superior sutil (zinc-800/80) para separar del contenido
 * - Fondo zinc-950 oscuro consistente con el resto de la landing
 * - Texto centrado con jerarquía de tamaños:
 *   - Equipo: text-sm (14px), zinc-500
 *   - Descripción: text-xs (12px), zinc-600 (más tenue)
 * - Padding vertical de 10 (40px)
 * - Contenedor con max-width y padding responsivo
 *
 * Simplicidad:
 * Footer minimalista que no compite visualmente con el contenido principal,
 * manteniendo la información esencial del equipo y contexto académico del proyecto.
 *
 * @component
 * @returns {JSX.Element} Footer con información del equipo y proyecto.
 *
 * @example
 * ```tsx
 * import { LandingFooter } from './components/landing/LandingFooter';
 *
 * function LandingPage() {
 *   return (
 *     <>
 *       <LandingHero />
 *       <LandingHowItWorks />
 *       <LandingTech />
 *       <LandingAbout />
 *       <LandingFooter />
 *     </>
 *   );
 * }
 * ```
 */
export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm text-zinc-500">
          Equipo Sofkianos · Christopher Pallo · Elian Condor · Leonel · Hans
          Ortiz · Jean Pierre
        </p>
        <p className="mt-2 text-center text-xs text-zinc-600">
          Taller: Sistema Distribuido — Arquitectura de Microservicios |
          Comunicación Asíncrona | Metodología AI-First
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
