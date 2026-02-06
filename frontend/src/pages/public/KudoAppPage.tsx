import React from 'react';
import { Link } from 'react-router-dom';
import KudoForm from '../../components/KudoForm';
import { Rocket, Sparkles } from 'lucide-react';

export const KudoAppPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header
        className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl"
        style={{
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,95,0,0.06)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF5F00]/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700/60 bg-zinc-800/80">
              <Rocket className="h-5 w-5 text-[#FF5F00]" aria-hidden />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-100">
              SofkianOS
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Sparkles className="h-4 w-4 text-[#FF5F00]/80" aria-hidden />
            <span className="text-sm font-medium">Kudos</span>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,95,0,0.12),transparent)]"
          aria-hidden
        />
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Send a Kudo
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400 sm:text-base">
            Recognize and celebrate the great work of your team.
          </p>
        </div>
        <KudoForm />
      </main>
    </div>
  );
};

export default KudoAppPage;
