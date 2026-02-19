import React from "react";
import { Timer, Trophy, Users } from "lucide-react";

/**
 * Componente "Acerca de" que presenta los beneficios clave de SofkianOS.
 *
 * Renderiza una sección informativa con tres tarjetas que destacan las ventajas
 * principales del sistema SofkianOS: arquitectura asíncrona, gamificación justa
 * y conexión remota entre equipos distribuidos.
 *
 * Estructura:
 * - **Título y descripción**: Encabezado centrado que posiciona a SofkianOS como
 *   solución de ingeniería (no solo un formulario) para conectar equipos.
 * - **Grid de 3 columnas**: En desktop (md breakpoint) las tarjetas se distribuyen
 *   horizontalmente, en móvil se apilan verticalmente.
 *
 * Tarjetas (Cards):
 * 1. **Sin Interrupciones** (Timer icon):
 *    - Destaca la arquitectura asíncrona con RabbitMQ
 *    - Beneficio: envío masivo de kudos sin congelamiento
 * 2. **Gamificación Justa** (Trophy icon):
 *    - El Worker calcula puntos y categorías en segundo plano
 *    - Beneficio: reconocimiento justo y automatizado
 * 3. **Conexión Remota** (Users icon):
 *    - Acorta distancias entre equipos distribuidos
 *    - Beneficio: agradecimiento tangible a distancia
 *
 * Efectos visuales:
 * - **Tarjetas con glass-morphism**: Fondo semitransparente con bordes sutiles
 * - **Hover interactivo**:
 *   - Borde cambia a naranja marca (brand/50)
 *   - Fondo se ilumina ligeramente
 *   - Translación hacia arriba (-translate-y-1)
 * - **Iconos con transición**: Fondo cambia de brand/10 a brand sólido,
 *   texto de marca a blanco en hover del grupo
 *
 * Accesibilidad:
 * - Anchor navegable con id="que-es" para scroll directo
 * - Jerarquía semántica con h2, h3 y párrafos descriptivos
 *
 * @component
 * @returns {JSX.Element} Sección "Acerca de" con grid de beneficios.
 *
 * @example
 * ```tsx
 * import { LandingAbout } from './components/landing/LandingAbout';
 *
 * function LandingPage() {
 *   return (
 *     <>
 *       <LandingHero />
 *       <LandingHowItWorks />
 *       <LandingTech />
 *       <LandingAbout />
 *       <LandingFooter />
 *     </>
 *   );
 * }
 * ```
 */
export const LandingAbout: React.FC = () => {
  return (
    <section
      id="que-es"
      className="relative border-t border-zinc-800 bg-zinc-950 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Potenciando nuestra Cultura Ágil
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            SofkianOS no es solo un formulario. Es una solución de ingeniería
            diseñada para mantener al equipo conectado.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-brand/50 hover:bg-white/[0.07] hover:-translate-y-1">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
              <Timer className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Sin Interrupciones
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Gracias a nuestra arquitectura asíncrona (RabbitMQ), puedes enviar
              Kudos masivos sin que el sistema se congele.
            </p>
          </div>
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-brand/50 hover:bg-white/[0.07] hover:-translate-y-1">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Gamificación Justa
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Cada reconocimiento suma. Nuestro Worker calcula puntos y
              categorías en segundo plano.
            </p>
          </div>
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-brand/50 hover:bg-white/[0.07] hover:-translate-y-1">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Conexión Remota
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Acortamos distancias. SofkianOS hace tangible el agradecimiento
              entre equipos distribuidos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
