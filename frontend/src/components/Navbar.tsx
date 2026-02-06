import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export interface NavbarProps {
  isAppView?: boolean;
  onLaunchApp: () => void;
  onNavigateToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAppView = false,
  onLaunchApp,
  onNavigateToSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigateToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`
        fixed top-0 z-50 w-full
        transition-all duration-300
        ${isScrolled || mobileMenuOpen
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'}
      `}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {}
        <button
          onClick={() => handleNavClick('top')}
          className="text-xl font-black tracking-tight text-white"
        >
          Sofkian
          <span className="text-white">OS</span>
          <span className="text-[#FF5F00] animate-pulse">_</span>
        </button>

        {}
        <nav className="hidden md:flex items-center text-sm">
          {!isAppView && (
            <>
              <button
                onClick={() => handleNavClick('como-funciona')}
                className="px-4 text-zinc-400 hover:text-white transition-colors"
              >
                Cómo funciona
              </button>

              <div className="h-5 w-px bg-white/10" />

              <button
                onClick={() => handleNavClick('tecnologia')}
                className="px-4 text-zinc-400 hover:text-white transition-colors"
              >
                Tecnología
              </button>

              <div className="h-5 w-px bg-white/10" />
            </>
          )}

          {}
          <button
            onClick={onLaunchApp}
            className="
              flex items-center gap-2 px-4
              text-white font-semibold
              hover:text-[#FF5F00] transition-colors
            "
          >
            {isAppView ? 'Volver' : 'Acceder'}
          </button>
        </nav>

        {}
        <button
          className="md:hidden text-zinc-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-md px-6 py-6">
          <div className="flex flex-col gap-4 text-sm">
            {!isAppView && (
              <>
                <button
                  onClick={() => handleNavClick('como-funciona')}
                  className="text-left text-zinc-400 hover:text-white"
                >
                  Cómo funciona
                </button>
                <button
                  onClick={() => handleNavClick('tecnologia')}
                  className="text-left text-zinc-400 hover:text-white"
                >
                  Tecnología
                </button>
              </>
            )}

            <button
              onClick={() => {
                onLaunchApp();
                setMobileMenuOpen(false);
              }}
              className="mt-4 flex items-center gap-2 text-white font-semibold hover:text-[#FF5F00]"
            >
              {isAppView ? 'Volver' : 'Acceder'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};