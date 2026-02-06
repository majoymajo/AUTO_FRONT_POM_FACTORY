import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export const LandingNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg outline-none focus:ring-2 focus:ring-[#FF5F00]/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          <span className="text-xl font-bold tracking-tight text-white">
            SofkianOS<span className="text-[#FF5F00]">_</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="#como-funciona"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Cómo Funciona
          </a>
          <a
            href="#tecnologia"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Tecnología
          </a>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FF5F00] px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_20px_rgba(255,95,0,0.4)] transition-all hover:bg-[#FF7A2E] hover:shadow-[0_0_28px_rgba(255,95,0,0.5)] focus:outline-none focus:ring-2 focus:ring-[#FF5F00] focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <Rocket className="h-4 w-4" aria-hidden />
            Launch App
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default LandingNav;
