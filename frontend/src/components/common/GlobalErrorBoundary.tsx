import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * High-level error boundary with a premium full-page fallback.
 */
export const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={() => (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-brand selection:text-zinc-950">

          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent opacity-50" />

          
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand/10 border border-brand/20 mb-4">
                <AlertTriangle className="w-10 h-10 text-brand drop-shadow-[0_0_10px_rgba(255,95,0,0.5)]" />
              </div>


            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Algo no salió <br />
                <span className="text-brand">como esperábamos</span>

              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Hemos detectado una anomalía en el sistema. No te preocupes, tus datos están a salvo.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => window.location.reload()}
                className="
                  group relative inline-flex items-center gap-3 px-8 py-4 
                  bg-brand text-white font-bold rounded-xl

                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                  shadow-[0_0_20px_rgba(255,95,0,0.3)]
                  hover:shadow-[0_0_30px_rgba(255,95,0,0.5)]
                "
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                Reiniciar Aplicación
              </button>
            </div>

            <p className="text-zinc-600 text-xs font-medium tracking-[0.2em] uppercase pt-12">
              SofkianOS Core v1.0.0
            </p>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
