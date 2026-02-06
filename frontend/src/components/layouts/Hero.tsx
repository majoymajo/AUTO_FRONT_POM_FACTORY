import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  title = 'HERO', 
  subtitle,
  children,
  className = '' 
}) => {
  return (
    <header 
      className={`
        relative
        w-full 
        bg-gradient-to-r 
        from-orange-500 
        via-orange-400 
        to-sky-400
        rounded-3xl 
        p-16
        md:p-24
        mb-8
        shadow-2xl
        shadow-orange-500/40
        border-2
        border-orange-300/30
        backdrop-blur-sm
        transform
        transition-all
        duration-500
        hover:scale-[1.01]
        hover:shadow-orange-500/60
        overflow-hidden
        animate-glow
        ${className}
      `}
      role="banner"
    >
      {}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {}
        <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg animate-fade-in">
          <span className="text-white text-sm font-semibold tracking-wide"> Sofkianos MVP </span>
        </div>

        <h1 className="
          text-6xl 
          md:text-8xl 
          font-extrabold 
          text-white 
          tracking-tight
          drop-shadow-2xl
          mb-6
          animate-fade-in
          leading-tight
        ">
          {title}
        </h1>
        {subtitle && (
          <p className="
            mt-6 
            text-2xl 
            md:text-3xl
            text-white/95
            font-light
            drop-shadow-lg
            max-w-3xl
            mx-auto
            animate-fade-in
          ">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  );
};
