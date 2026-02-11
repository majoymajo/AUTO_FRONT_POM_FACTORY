import React from 'react';
import { ArrowRight, ChevronRight, Gift, Heart, ChevronsDown } from 'lucide-react';
import { useLaunchSlider } from '../../hooks/landing/useLaunchSlider';

export interface LandingHeroProps {
  onLaunchApp?: () => void;
}

const INITIAL_SLIDER = 11;

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchApp }) => {
  const {
    sliderValue,
    isDragging,
    sliderRef,
    handleStart,
    handleMove,
    handleEnd,
  } = useLaunchSlider({
    initialSliderValue: INITIAL_SLIDER,
    onLaunch: onLaunchApp,
  });

  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden pt-20 pb-20 px-4">
      <div className="absolute inset-0 -z-20 bg-zinc-950" />
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-brand/10 via-brand/5 to-transparent -z-10 blur-3xl" />


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
          <span className="text-brand drop-shadow-[0_0_35px_rgba(255,95,0,0.8)]">
            OS
          </span>
          <span className="text-brand animate-pulse">_</span>
        </h1>

        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className="p-8 pb-6">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-zinc-300 mb-1">
                  <Heart className="h-5 w-5 text-brand" />

                  <span className="font-bold text-white text-xl">Sofkian</span>
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  Nuestra Esencia
                </span>
              </div>

              <span className="hidden sm:block text-zinc-600 font-mono text-2xl">+</span>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-zinc-300 mb-1">
                  <Gift className="h-5 w-5 text-brand" />

                  <span className="font-bold text-white text-xl">OS</span>
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                  de Kud<span className="text-brand font-bold">os</span>

                </span>
              </div>

              <span className="hidden sm:block text-zinc-600 font-mono text-2xl">=</span>

              <div className="text-brand font-bold text-xl border-b-2 border-brand pb-1">

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
                className={`absolute top-0 left-0 h-full bg-brand/20 ${

                  isDragging ? '' : 'transition-all duration-300 ease-out'
                }`}
                style={{ width: `${sliderValue}%` }}
              />
              <div
                className={`absolute top-1 bottom-1 w-16 rounded-full bg-brand

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
          <ChevronsDown className="h-5 w-5 text-brand animate-bounce" />

        </div>
      </div>
    </section>
  );
};
