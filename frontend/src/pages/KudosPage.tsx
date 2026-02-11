import React from 'react';
import KudoForm from '../components/KudoForm';
import { FormErrorBoundary } from '../components/common/FormErrorBoundary';

const KudosPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand/10 via-zinc-950 to-zinc-950" />

      <div className="mx-auto w-full max-w-4xl px-4 py-28 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Reconoce a un{' '}
            <span className="text-brand drop-shadow-[0_0_15px_rgba(255,95,0,0.5)]">
              Compañero
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg text-zinc-400">
            Tu reconocimiento fortalece nuestra cultura. El envío es
            procesado asíncronamente para no detener tu flujo.
          </p>
        </div>

        <FormErrorBoundary>
          <KudoForm />
        </FormErrorBoundary>
      </div>
    </div>
  );
};


export default KudosPage;
