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
        border-2 
        border-white 
        rounded-lg 
        p-6 
        mt-6
        ${className}
      `}
      role="contentinfo"
    >
      <div className="max-w-4xl mx-auto text-center">
        {children || (
          <p className="text-white text-lg tracking-wider">
            {text}
          </p>
        )}
      </div>
    </footer>
  );
};
