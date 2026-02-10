import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm text-zinc-500">
          Equipo Sofkianos · Christopher Pallo · Elian Condor · Leonel · Hans Ortiz · Jean Pierre
        </p>
        <p className="mt-2 text-center text-xs text-zinc-600">
         Taller: Sistema Distribuido — Arquitectura de Microservicios | Comunicación Asíncrona | Metodología
          AI-First
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
