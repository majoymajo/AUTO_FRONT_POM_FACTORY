import React from 'react';

interface FooterProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  text = 'FOOTER',
  children,
  className = '' 
}) => {
  return (
    <footer 
      className={`
        w-full 
        bg-gradient-to-r
        from-sky-400
        via-orange-400
        to-orange-500
        rounded-2xl
        p-8
        mt-8
        shadow-2xl
        shadow-orange-500/30
        border-2
        border-orange-300/20
        backdrop-blur-sm
        ${className}
      `}
      role="contentinfo"
    >
      <div className="max-w-4xl mx-auto text-center">
        {children || (
          <p className="text-white text-lg font-semibold tracking-wide drop-shadow-md">
            {text}
          </p>
        )}
      </div>
    </footer>
  );
};
