import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronRight, Gift, Heart, ChevronsDown } from 'lucide-react';

export interface LandingHeroProps {
  onLaunchApp?: () => void;
}

const INITIAL_SLIDER = 11;

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchApp }) => {
  const [sliderValue, setSliderValue] = useState(INITIAL_SLIDER);
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
        onLaunchApp?.();
        setSliderValue(INITIAL_SLIDER);
        setCompleted(false);
      }, 400);
    } else {
      setSliderValue(INITIAL_SLIDER);
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
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, sliderValue]);

  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden pt-20 pb-20 px-4">
      <div className="absolute inset-0 -z-20 bg-zinc-950" />
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#FF5F00]/10 via-[#FF5F00]/5 to-transparent -z-10 blur-3xl" />

      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-5xl text-center mt-10">
        <h1
          className="relative cursor-default text-7xl font-black tracking-tighter text-transparent sm:text-8xl md:text-9xl transition-all duration-500 hover:-translate-y-2 mb-12"
          style={{
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.9)',
            textShadow: '0 0 30px rgba(255,95,0,0.2)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.color = 'white';
            el.style.webkitTextStroke = '0px transparent';
            el.style.textShadow =
              '0 0 30px rgba(255,95,0,0.8), 0 0 60px rgba(255,95,0,0.4), 0 10px 20px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.color = 'transparent';
            el.style.webkitTextStroke = '2px rgba(255, 255, 255, 0.9)';
            el.style.textShadow = '0 0 30px rgba(255,95,0,0.2)';
          }}
        >
          Sofkian
          <span className="text-[#FF5F00] drop-shadow-[0_0_35px_rgba(255,95,0,0.8)]">
            OS
          </span>
          <span className="text-[#FF5F00] animate-pulse">_</span>
        </h1>

        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className="p-8 pb-6">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-zinc-300 mb-1">
                  <Heart className="h-5 w-5 text-[#FF5F00]" />
                  <span className="font-bold text-white text-xl">Sofkian</span>
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  Nuestra Esencia
                </span>
              </div>

              <span className="hidden sm:block text-zinc-600 font-mono text-2xl">+</span>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-zinc-300 mb-1">
                  <Gift className="h-5 w-5 text-[#FF5F00]" />
                  <span className="font-bold text-white text-xl">OS</span>
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  de Kud<span className="text-[#FF5F00] font-bold">os</span>
                </span>
              </div>

              <span className="hidden sm:block text-zinc-600 font-mono text-2xl">=</span>

              <div className="text-[#FF5F00] font-bold text-xl border-b-2 border-[#FF5F00] pb-1">
                Cultura de Recompensas
              </div>
            </div>

            <p className="mt-3 pt-3 border-t border-white/5 text-[15px] text-zinc-400 italic leading-snug">
              “Transformamos la identidad <strong>Sofkiana</strong> en{' '}
              <strong>Kudos</strong> tangibles. El término <strong>Kudos</strong>{' '}
              proviene del griego <em>kŷdos</em>, que significa honor,
              reconocimiento y prestigio por un logro. Aquí representa la forma
              en que celebramos los aportes reales de cada persona.”
            </p>
          </div>

          <div className="bg-zinc-950/50 p-6 border-t border-white/5">
            <div
              ref={sliderRef}
              className="relative h-16 w-full max-w-md mx-auto rounded-full bg-zinc-900 border border-zinc-700 shadow-inner overflow-hidden cursor-pointer select-none"
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className={`text-sm font-bold tracking-widest uppercase transition-opacity duration-300 ${
                    sliderValue > 50 ? 'opacity-0' : 'opacity-100 text-zinc-500'
                  }`}
                >
                  Desliza para conectar
                </span>

                <div className="absolute right-4 flex opacity-20 animate-pulse">
                  <ChevronRight className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div
                className={`absolute top-0 left-0 h-full bg-[#FF5F00]/20 ${
                  isDragging ? '' : 'transition-all duration-300 ease-out'
                }`}
                style={{ width: `${sliderValue}%` }}
              />
              <div
                className={`absolute top-1 bottom-1 w-16 rounded-full bg-[#FF5F00]
                flex items-center justify-center
                shadow-[0_0_25px_rgba(255,95,0,0.5)]
                ${isDragging ? '' : 'transition-all duration-300 ease-out'}
                z-10 hover:bg-[#FF7A2E] active:scale-95`}
                style={{
                  left: `calc(${sliderValue}% - 48px)`,
                }}
              >
                <ArrowRight className="w-7 h-7 text-zinc-950 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-20 flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
          onClick={() =>
            document
              .getElementById('como-funciona')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
            Descubrir Arquitectura
          </span>
          <ChevronsDown className="h-5 w-5 text-[#FF5F00] animate-bounce" />
        </div>
      </div>
    </section>
  );
};