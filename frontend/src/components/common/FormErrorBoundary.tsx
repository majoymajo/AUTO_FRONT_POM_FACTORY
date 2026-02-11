import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface FormErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Granular error boundary for forms to prevent full-page crashes.
 */
export const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={(_error, resetError) => (
        <div className="w-full bg-zinc-900/50 border border-red-500/20 rounded-2xl p-8 text-center space-y-6 backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Error en el Formulario</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px] mx-auto">
              Hubo un problema procesando los campos. Por favor, intenta restablecer el formulario.
            </p>
          </div>

          <button
            onClick={() => {
              resetError();
              window.location.hash = ''; // Clear sub-state if necessary
            }}
            className="
              inline-flex items-center gap-2 px-6 py-3 
              bg-zinc-800 text-white text-sm font-semibold rounded-lg
              hover:bg-zinc-700 transition-colors border border-white/5
            "
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer Formulario
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
