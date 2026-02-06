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
        bg-gradient-to-br
        from-orange-600
        via-orange-500
        to-orange-400
        rounded-3xl
        p-10
        md:p-12
        mt-12
        shadow-2xl
        shadow-orange-600/40
        border-2
        border-orange-400/30
        backdrop-blur-sm
        overflow-hidden
        relative
        ${className}
      `}
      role="contentinfo"
    >
      {}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-sky-300 rounded-full blur-3xl"></div>
      </div>

      {children || (
        <div className="relative max-w-6xl mx-auto">
          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                {text}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
                Reconoce y celebra el trabajo excepcional del equipo Sofkianos
              </p>
            </div>

            {}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-3 drop-shadow-md">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm drop-shadow">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm drop-shadow">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm drop-shadow">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>

            {}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-white mb-3 drop-shadow-md">
                Síguenos
              </h4>
              <div className="flex justify-center md:justify-end gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  aria-label="LinkedIn"
                >
                  <span className="text-white text-lg"></span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  aria-label="Twitter"
                >
                  <span className="text-white text-lg"></span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  aria-label="GitHub"
                >
                  <span className="text-white text-lg"></span>
                </a>
              </div>
            </div>
          </div>

          {}
          <div className="h-px bg-white/20 mb-6"></div>

          {}
          <div className="text-center">
            <p className="text-white/80 text-sm drop-shadow">
              © {new Date().getFullYear()} Sofkianos MVP. Hecho con  por el equipo
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};
