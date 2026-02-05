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
      className={`w-full border-2 border-white rounded-lg p-8 mb-6 ${className}`}
      role="banner"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-gray-300">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  );
};
