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
        w-full 
        bg-gradient-to-r 
        from-orange-500 
        via-orange-400 
        to-sky-400
        rounded-2xl 
        p-12 
        mb-8
        shadow-2xl
        shadow-orange-500/30
        border-2
        border-orange-300/20
        backdrop-blur-sm
        transform
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-orange-500/50
        ${className}
      `}
      role="banner"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="
          text-5xl 
          md:text-7xl 
          font-bold 
          text-white 
          tracking-tight
          drop-shadow-lg
          mb-3
          animate-fade-in
        ">
          {title}
        </h1>
        {subtitle && (
          <p className="
            mt-4 
            text-xl 
            md:text-2xl
            text-white/90
            font-light
            drop-shadow-md
          ">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  );
};
