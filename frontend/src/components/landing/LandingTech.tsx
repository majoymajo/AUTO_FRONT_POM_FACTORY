import {
  SiReact,
  SiVite,
  SiTypescript,
  SiTailwindcss,
  SiSpringboot,
  SiPostgresql,
  SiDocker,
  SiRabbitmq,
} from "react-icons/si";
import { useInfiniteScroll } from "../../hooks/landing/useInfiniteScroll";

/**
 * Stack tecnológico de SofkianOS.
 * Array de tecnologías con su nombre y componente de icono correspondiente.
 *
 * @constant {Array<{name: string, icon: React.ComponentType}>}
 */
const techStack = [
  { name: "React", icon: SiReact },
  { name: "Vite", icon: SiVite },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Spring Boot", icon: SiSpringboot },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Docker", icon: SiDocker },
  { name: "RabbitMQ", icon: SiRabbitmq },
];

/**
 * Componente que muestra el stack tecnológico de SofkianOS con carrusel infinito.
 *
 * Renderiza una sección que exhibe todas las tecnologías utilizadas en el proyecto
 * mediante iconos animados en un carrusel de scroll infinito automático. Los iconos
 * se desplazan horizontalmente de forma continua creando un efecto visual atractivo.
 *
 * Características:
 * - **Carrusel infinito**: Los iconos se duplican y se desplazan continuamente usando
 *   el hook {@link useInfiniteScroll} que aplica transformaciones CSS.
 * - **Velocidad configurable**: El hook recibe 0.5 como velocidad de desplazamiento.
 * - **Iconos interactivos**: Cada icono tiene efectos hover:
 *   - Cambia de color gris (zinc-300) a naranja marca (brand)
 *   - Escala al 110%
 *   - Aplica drop-shadow naranja brillante
 *   - El nombre cambia de gris (zinc-500) a blanco
 * - **Duplicación para continuidad**: El array techStack se duplica para crear el
 *   efecto de loop infinito sin saltos visuales.
 * - **Espaciado generoso**: Gap de 28 (112px) entre iconos para claridad visual.
 * - **Decoración**: Gradiente naranja difuminado en la parte superior y línea divisoria
 *   degradada en la parte inferior.
 *
 * Visual:
 * - Título "Stack del Sistema" con palabra "Sistema" en color marca
 * - Subtítulo "Infraestructura viva · Modular · Escalable"
 * - Iconos de 6xl (60px) con nombres en mayúsculas pequeñas debajo
 * - Fondo zinc-950 oscuro con efectos de luz de marca
 *
 * @component
 * @returns {JSX.Element} Sección con carrusel infinito del stack tecnológico.
 *
 * @example
 * ```tsx
 * import { LandingTech } from './components/landing/LandingTech';
 *
 * function LandingPage() {
 *   return (
 *     <>
 *       <LandingHero />
 *       <LandingHowItWorks />
 *       <LandingTech />
 *       <LandingAbout />
 *     </>
 *   );
 * }
 * ```
 */
export const LandingTech = () => {
  const { trackRef } = useInfiniteScroll(0.5);

  return (
    <section className="relative py-32 overflow-hidden bg-zinc-950">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/10 to-transparent blur-3xl" />

      <div className="relative z-10 mb-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Stack del{" "}
          <span className="text-brand drop-shadow-[0_0_20px_rgba(255,95,0,0.6)]">
            Sistema
          </span>
        </h2>
        <p className="mt-4 text-xs uppercase tracking-widest text-zinc-500">
          Infraestructura viva · Modular · Escalable
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-28 px-16 will-change-transform"
        >
          {[...techStack, ...techStack].map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div
                key={i}
                className="group flex min-w-[180px] flex-col items-center justify-center"
              >
                <Icon
                  className="
                    text-6xl
                    text-zinc-300
                    transition-all duration-300
                    group-hover:text-brand
                    group-hover:scale-110
                    group-hover:drop-shadow-[0_0_25px_rgba(255,95,0,0.6)]

                  "
                />
                <span className="mt-4 text-[11px] tracking-widest uppercase text-zinc-500 group-hover:text-white">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-24 flex justify-center">
        <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-brand to-transparent opacity-40" />
      </div>
    </section>
  );
};
