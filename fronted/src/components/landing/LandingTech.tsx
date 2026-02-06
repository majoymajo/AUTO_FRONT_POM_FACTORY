import { useEffect, useRef } from 'react';
import {SiReact,SiVite,SiTypescript,SiTailwindcss,SiSpringboot,SiPostgresql,SiDocker,SiRabbitmq,} from 'react-icons/si';

const techStack = [
  { name: 'React', icon: SiReact },
  { name: 'Vite', icon: SiVite },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'Spring Boot', icon: SiSpringboot },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Docker', icon: SiDocker },
  { name: 'RabbitMQ', icon: SiRabbitmq },
];

export const LandingTech = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    let position = 0;
    const speed = 0.5;

    const animate = () => {
      position -= speed;

      if (trackRef.current) {
        const resetPoint = trackRef.current.scrollWidth / 2;

        if (Math.abs(position) >= resetPoint) {
          position = 0;
        }

        trackRef.current.style.transform = `translateX(${position}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <section className="relative py-32 overflow-hidden bg-zinc-950">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FF5F00]/10 to-transparent blur-3xl" />

      <div className="relative z-10 mb-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Stack del{' '}
          <span className="text-[#FF5F00] drop-shadow-[0_0_20px_rgba(255,95,0,0.6)]">
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
                    group-hover:text-[#FF5F00]
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
        <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-[#FF5F00] to-transparent opacity-40" />
      </div>
    </section>
  );
};