import React from 'react';
import { useKudos } from '../../hooks';

export const KudosList: React.FC = () => {
  const { kudos, loading } = useKudos();

  if (loading && kudos.length === 0) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="relative mt-20 mb-20 space-y-8 px-4">
      {/* Decorative background elements for the list section */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1.5s' }}></div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
          Mensajes Recientes <span className="text-orange-400">📬</span>
        </h2>
        <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
          Mira lo que el equipo está celebrando el día de hoy
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {kudos.map((kudo, index) => (
          <div 
            key={kudo.id}
            className="
              group
              relative
              bg-gradient-to-br 
              from-slate-800/60 
              to-slate-900/60 
              backdrop-blur-xl 
              border-2 
              border-orange-400/20 
              p-8 
              rounded-[2rem] 
              shadow-2xl 
              hover:shadow-orange-500/20 
              transition-all 
              duration-500 
              transform 
              hover:-translate-y-2
              hover:scale-[1.02]
              hover:border-orange-400/40
              animate-fade-in
            "
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-[2rem] bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="px-4 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest">
                    Kudo #{kudo.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/30 text-xs font-medium">
                    {new Date(kudo.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                  <span className="text-white/30 text-xs font-medium">
                    {new Date(kudo.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-white text-xl md:text-2xl font-medium italic leading-relaxed tracking-wide">
                  "{kudo.message}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-300 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-500/40 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    {(kudo.from || 'A').charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-400 rounded-lg border-2 border-slate-900 flex items-center justify-center shadow-md">
                    <span className="text-[10px]">✨</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-base font-bold tracking-tight">
                      {kudo.from || 'Anónimo'}
                    </span>
                    <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 text-[10px] font-bold rounded-md border border-sky-500/20 uppercase">
                      Sender
                    </span>
                  </div>
                  <span className="text-white/50 text-sm">
                    Para: <span className="text-orange-300/80 font-semibold">{kudo.to || 'Equipo'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {kudos.length === 0 && (
        <div className="text-center p-20 bg-slate-800/30 rounded-[3rem] border-4 border-dashed border-white/5 animate-pulse">
          <div className="text-6xl mb-6 opacity-20">📭</div>
          <h3 className="text-2xl font-bold text-white/40">Aún no hay kudos</h3>
          <p className="text-white/20 mt-2">¡Sé el primero en celebrar a un compañero!</p>
        </div>
      )}
    </div>
  );
};

