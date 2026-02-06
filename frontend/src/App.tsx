import { Navbar } from './components/Navbar';
import KudoForm from './components/KudoForm';
import { LandingHero } from './components/landing/LandingHero';
import { LandingHowItWorks } from './components/landing/LandingHowItWorks';
import { LandingTech } from './components/landing/LandingTech';
import { LandingFooter } from './components/landing/LandingFooter';
import { useApp } from './hooks/useApp';
import './index.css';

function App() {
  const {
    isAppView,
    isTransitioning,
    landingRef,
    handleLaunchApp,
    handleNavigate,
  } = useApp();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#FF5F00] selection:text-zinc-950">
      <Navbar
        isAppView={isAppView}
        onLaunchApp={handleLaunchApp}
        onNavigateToSection={handleNavigate}
      />

      <main className="relative overflow-hidden">
        <div
          className={`
            transition-all duration-700 ease-out
            ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}
          `}
        >
          {isAppView ? (
            <div className="min-h-screen flex items-center">
              <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FF5F00]/10 via-zinc-950 to-zinc-950" />

              <div className="mx-auto w-full max-w-4xl px-4 py-28 sm:px-6">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                    Reconoce a un{' '}
                    <span className="text-[#FF5F00] drop-shadow-[0_0_15px_rgba(255,95,0,0.5)]">
                      Compañero
                    </span>
                  </h2>
                  <p className="mx-auto mt-6 max-w-lg text-lg text-zinc-400">
                    Tu reconocimiento fortalece nuestra cultura. El envío es
                    procesado asíncronamente para no detener tu flujo.
                  </p>
                </div>

                <KudoForm />
              </div>
            </div>
          ) : (
            <div ref={landingRef}>
              <LandingHero onLaunchApp={handleLaunchApp} />
              <div id="como-funciona">
                <LandingHowItWorks />
              </div>
              <div id="tecnologia">
                <LandingTech />
              </div>
              <LandingFooter />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
