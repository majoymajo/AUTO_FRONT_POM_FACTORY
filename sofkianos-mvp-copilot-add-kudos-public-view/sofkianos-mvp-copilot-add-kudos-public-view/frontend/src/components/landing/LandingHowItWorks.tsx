import React from "react";
import { User, Globe, Server, Database, Layers } from "lucide-react";
import { useArchitectureAnimation } from "../../hooks/landing/useArchitectureAnimation";

/**
 * Calcula la posición (x, y) de un punto en una curva Bézier cúbica.
 *
 * @function getBezierXY
 * @param {number} t - Progreso en la curva (0 a 1).
 * @param {number} sx - Coordenada x del punto inicial.
 * @param {number} sy - Coordenada y del punto inicial.
 * @param {number} cp1x - Coordenada x del primer punto de control.
 * @param {number} cp1y - Coordenada y del primer punto de control.
 * @param {number} cp2x - Coordenada x del segundo punto de control.
 * @param {number} cp2y - Coordenada y del segundo punto de control.
 * @param {number} ex - Coordenada x del punto final.
 * @param {number} ey - Coordenada y del punto final.
 * @returns {{x: number, y: number}} Coordenadas del punto en la curva.
 */
const getBezierXY = (
  t: number,
  sx: number,
  sy: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  ex: number,
  ey: number,
) => {
  return {
    x:
      Math.pow(1 - t, 3) * sx +
      3 * Math.pow(1 - t, 2) * t * cp1x +
      3 * (1 - t) * Math.pow(t, 2) * cp2x +
      Math.pow(t, 3) * ex,
    y:
      Math.pow(1 - t, 3) * sy +
      3 * Math.pow(1 - t, 2) * t * cp1y +
      3 * (1 - t) * Math.pow(t, 2) * cp2y +
      Math.pow(t, 3) * ey,
  };
};

/**
 * Calcula el ángulo de rotación (en grados) de la tangente en un punto de una curva Bézier cúbica.
 *
 * @function getBezierAngle
 * @param {number} t - Progreso en la curva (0 a 1).
 * @param {number} sx - Coordenada x del punto inicial.
 * @param {number} sy - Coordenada y del punto inicial.
 * @param {number} cp1x - Coordenada x del primer punto de control.
 * @param {number} cp1y - Coordenada y del primer punto de control.
 * @param {number} cp2x - Coordenada x del segundo punto de control.
 * @param {number} cp2y - Coordenada y del segundo punto de control.
 * @param {number} ex - Coordenada x del punto final.
 * @param {number} ey - Coordenada y del punto final.
 * @returns {number} Ángulo en grados de la tangente en el punto t.
 */
const getBezierAngle = (
  t: number,
  sx: number,
  sy: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  ex: number,
  ey: number,
) => {
  const dx =
    3 * Math.pow(1 - t, 2) * (cp1x - sx) +
    6 * (1 - t) * t * (cp2x - cp1x) +
    3 * Math.pow(t, 2) * (ex - cp2x);
  const dy =
    3 * Math.pow(1 - t, 2) * (cp1y - sy) +
    6 * (1 - t) * t * (cp2y - cp1y) +
    3 * Math.pow(t, 2) * (ey - cp2y);
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

/**
 * Calcula la posición (x, y) de un punto en una línea recta mediante interpolación lineal.
 *
 * @function getLinearXY
 * @param {number} t - Progreso en la línea (0 a 1).
 * @param {number} sx - Coordenada x del punto inicial.
 * @param {number} sy - Coordenada y del punto inicial.
 * @param {number} ex - Coordenada x del punto final.
 * @param {number} ey - Coordenada y del punto final.
 * @returns {{x: number, y: number}} Coordenadas del punto en la línea.
 */
const getLinearXY = (
  t: number,
  sx: number,
  sy: number,
  ex: number,
  ey: number,
) => ({
  x: sx + (ex - sx) * t,
  y: sy + (ey - sy) * t,
});

/**
 * Calcula el ángulo de rotación (en grados) de una línea recta.
 *
 * @function getLinearAngle
 * @param {number} sx - Coordenada x del punto inicial.
 * @param {number} sy - Coordenada y del punto inicial.
 * @param {number} ex - Coordenada x del punto final.
 * @param {number} ey - Coordenada y del punto final.
 * @returns {number} Ángulo en grados de la línea.
 */
const getLinearAngle = (sx: number, sy: number, ex: number, ey: number) => {
  return Math.atan2(ey - sy, ex - sx) * (180 / Math.PI);
};

/**
 * Componente que muestra la arquitectura de SofkianOS con animación interactiva.
 *
 * Renderiza un diagrama arquitectónico animado que visualiza el flujo de datos a través
 * del sistema SofkianOS: desde el empleado que envía un kudo, pasando por la UI web,
 * el Producer API, RabbitMQ, el Consumer Worker y finalmente la base de datos.
 *
 * Componentes del diagrama:
 * 1. **Empleado Sofka**: Nodo de origen del kudo
 * 2. **SofkianOS Web**: Frontend React que envía la petición JSON
 * 3. **Producer API**: Spring Boot que valida y publica el evento
 * 4. **RabbitMQ**: Broker de mensajes que desacopla asíncronamente
 * 5. **Consumer Worker**: Spring Boot Listener que procesa la lógica pesada
 * 6. **Database**: PostgreSQL para persistencia final
 *
 * Animación:
 * - Un "paquete de datos" (rect naranja brillante) viaja entre nodos siguiendo paths SVG
 * - Soporta 5 paths diferentes (lineal y Bézier cúbicos)
 * - Los nodos se iluminan con bordes naranjas y efectos de escala cuando están activos
 * - El paquete rota según la tangente del path para simular movimiento realista
 * - Ciclo continuo: viaje (2000ms) → idle (1500ms) → siguiente path
 *
 * Gestión de estado:
 * - Usa el hook {@link useArchitectureAnimation} para controlar la animación
 * - `pathIndex`: Índice del path actual (0-4)
 * - `status`: Estado de la animación ('TRAVELING' | 'IDLE')
 * - `progress`: Progreso en el path actual (0-1)
 * - `isNodeActive(index)`: Función que determina si un nodo debe estar iluminado
 *
 * Responsive:
 * - Diagrama completo solo visible en pantallas grandes (lg breakpoint)
 * - Mensaje de escritorio recomendado en pantallas pequeñas
 *
 * @component
 * @returns {JSX.Element} Sección con diagrama arquitectónico animado de SofkianOS.
 *
 * @example
 * ```tsx
 * import { LandingHowItWorks } from './components/landing/LandingHowItWorks';
 *
 * function LandingPage() {
 *   return (
 *     <>
 *       <LandingHero />
 *       <LandingHowItWorks />
 *       <LandingTech />
 *     </>
 *   );
 * }
 * ```
 */
export const LandingHowItWorks: React.FC = () => {
  const { pathIndex, status, progress, isNodeActive } =
    useArchitectureAnimation({
      travelDuration: 2000,
      idleDuration: 1500,
      pathCount: 5,
    });

  const renderDataPacket = () => {
    if (status !== "TRAVELING") return null;

    let pos = { x: 0, y: 0 };
    let angle = 0;

    switch (pathIndex) {
      case 0:
        pos = getLinearXY(progress, 180, 300, 320, 300);
        angle = getLinearAngle(180, 300, 320, 300);
        break;
      case 1:
        pos = getBezierXY(progress, 450, 300, 500, 300, 500, 150, 550, 150);
        angle = getBezierAngle(
          progress,
          450,
          300,
          500,
          300,
          500,
          150,
          550,
          150,
        );
        break;
      case 2:
        pos = getBezierXY(progress, 680, 150, 730, 150, 730, 450, 680, 450);
        angle = getBezierAngle(
          progress,
          680,
          150,
          730,
          150,
          730,
          450,
          680,
          450,
        );
        break;
      case 3:
        pos = getBezierXY(progress, 680, 450, 730, 450, 730, 150, 850, 150);
        angle = getBezierAngle(
          progress,
          680,
          450,
          730,
          450,
          730,
          150,
          850,
          150,
        );
        break;
      case 4:
        pos = getBezierXY(progress, 980, 150, 1030, 150, 1030, 450, 980, 450);
        angle = getBezierAngle(
          progress,
          980,
          150,
          1030,
          150,
          1030,
          450,
          980,
          450,
        );
        break;
    }

    return (
      <rect
        x={-15}
        y={-3}
        width="30"
        height="6"
        fill="#FF5F00"
        rx="3"
        className="drop-shadow-[0_0_10px_rgba(255,95,0,1)]"
        transform={`translate(${pos.x}, ${pos.y}) rotate(${angle})`}
      />
    );
  };

  return (
    <section
      id="como-funciona"
      className="relative border-t border-zinc-800 bg-zinc-950 py-24 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Arquitectura <span className="text-brand">SofkianOS</span>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Así es como SofkianOS procesa miles de reconocimientos sin
            bloquearse. Sigue el flujo de los datos a través de nuestro pipeline
            asíncrono.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl h-[600px] hidden lg:block rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-8 shadow-2xl">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 stroke-zinc-700"
            style={{ strokeWidth: 2 }}
          >
            <path d="M 180 300 C 250 300, 250 300, 320 300" fill="none" />
            <path d="M 450 300 C 500 300, 500 150, 550 150" fill="none" />
            <path d="M 680 150 C 730 150, 730 450, 680 450" fill="none" />
            <path
              d="M 680 450 C 730 450, 730 150, 850 150"
              fill="none"
              strokeDasharray="5,5"
            />
            <path d="M 980 150 C 1030 150, 1030 450, 980 450" fill="none" />
          </svg>

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {renderDataPacket()}
          </svg>

          {/* Source Node: Employee */}
          <div className="absolute top-1/2 left-[50px] -translate-y-1/2 flex flex-col items-center gap-3">
            <div
              className={`w-24 h-24 rounded-2xl bg-zinc-800 border-2 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)] z-10 transition-all duration-300 ${
                isNodeActive(0)
                  ? "border-brand shadow-[0_0_30px_rgba(255,95,0,0.5)] scale-110"
                  : "border-zinc-600"
              }`}
            >
              <User
                className={`w-10 h-10 transition-colors ${isNodeActive(0) ? "text-brand" : "text-white"}`}
              />

              {isNodeActive(0) && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse" />
              )}
            </div>
            <span className="text-sm font-bold text-zinc-300 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-700">
              Empleado Sofka
            </span>
          </div>

          {/* UI Node: React Web */}
          <div className="absolute top-1/2 left-[320px] -translate-y-1/2 flex flex-col items-center gap-3">
            <div
              className={`w-40 h-28 rounded-xl bg-zinc-900 border flex flex-col items-center justify-center gap-2 z-10 transition-all duration-300 ${
                isNodeActive(1)
                  ? "border-brand shadow-[0_0_30px_rgba(255,95,0,0.3)] scale-110"
                  : "border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              }`}
            >
              <Globe
                className={`w-8 h-8 transition-colors ${isNodeActive(1) ? "text-brand" : "text-blue-400"}`}
              />

              <span className="text-white font-bold">SofkianOS Web</span>
              <span className="text-[10px] text-blue-300 bg-blue-900/20 px-2 py-0.5 rounded">
                React + Vite
              </span>
            </div>
            <span className="text-xs text-zinc-500 max-w-[120px] text-center bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800">
              Envía petición JSON
            </span>
          </div>

          {/* Backend Node: Producer */}
          <div className="absolute top-[80px] left-[550px] flex flex-col items-center gap-3">
            <div
              className={`w-40 h-28 rounded-xl bg-zinc-900 border flex flex-col items-center justify-center gap-2 z-10 transition-all duration-300 ${
                isNodeActive(2)
                  ? "border-brand shadow-[0_0_30px_rgba(255,95,0,0.3)] scale-110"
                  : "border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
              }`}
            >
              <Server
                className={`w-8 h-8 transition-colors ${isNodeActive(2) ? "text-brand" : "text-green-400"}`}
              />

              <span className="text-white font-bold">Producer API</span>
              <span className="text-[10px] text-green-300 bg-green-900/20 px-2 py-0.5 rounded">
                Spring Boot
              </span>
            </div>
            <span className="text-xs text-zinc-500 text-center bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800">
              Valida y Publica Evento
            </span>
          </div>

          {/* Broker Node: RabbitMQ */}
          <div className="absolute bottom-[80px] left-[550px] flex flex-col items-center gap-3">
            <div
              className={`relative w-40 h-28 rounded-xl bg-brand/10 border border-brand flex flex-col items-center justify-center gap-2 z-10 transition-all duration-300 ${
                isNodeActive(3)
                  ? "shadow-[0_0_50px_rgba(255,95,0,0.6)] scale-110 bg-brand/30"
                  : "shadow-[0_0_40px_rgba(255,95,0,0.2)]"
              }`}
            >
              <div className={isNodeActive(3) ? "animate-bounce" : ""}>
                <Layers className="w-10 h-10 text-brand" />
              </div>
              <span className="text-white font-bold">RabbitMQ</span>
              <span className="text-[10px] text-orange-200 bg-brand/20 px-2 py-0.5 rounded">
                Broker / Store
              </span>
            </div>
            <span className="text-xs text-brand font-bold text-center animate-pulse bg-zinc-950/50 px-2 py-1 rounded border border-brand/30">
              Desacople Asíncrono
            </span>
          </div>

          {/* Backend Node: Consumer */}
          <div className="absolute top-[80px] right-[150px] flex flex-col items-center gap-3">
            <div
              className={`w-40 h-28 rounded-xl bg-zinc-900 border flex flex-col items-center justify-center gap-2 z-10 transition-all duration-300 ${
                isNodeActive(4)
                  ? "border-[#FF5F00] shadow-[0_0_30px_rgba(255,95,0,0.3)] scale-110"
                  : "border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]"
              }`}
            >
              <Server
                className={`w-8 h-8 transition-colors ${isNodeActive(4) ? "text-[#FF5F00]" : "text-purple-400"}`}
              />
              <span className="text-white font-bold">Consumer Worker</span>
              <span className="text-[10px] text-purple-300 bg-purple-900/20 px-2 py-0.5 rounded">
                Spring Boot Listener
              </span>
            </div>
            <span className="text-xs text-zinc-500 text-center bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800">
              Procesa Lógica Pesada
            </span>
          </div>

          {/* DB Node: Persistence */}
          <div className="absolute bottom-[80px] right-[150px] flex flex-col items-center gap-3">
            <div
              className={`w-40 h-28 rounded-xl bg-zinc-900 border shadow-xl flex flex-col items-center justify-center gap-2 z-10 transition-all duration-300 ${
                isNodeActive(5)
                  ? "border-[#FF5F00] shadow-[0_0_30px_rgba(255,95,0,0.3)] scale-110 opacity-100"
                  : "border-zinc-700 opacity-70"
              }`}
            >
              <Database
                className={`w-8 h-8 transition-colors ${isNodeActive(5) ? "text-[#FF5F00]" : "text-zinc-500"}`}
              />
              <span className="text-white font-bold">Database</span>
              <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                PostgreSQL (Future)
              </span>
            </div>
            <span className="text-xs text-zinc-500 text-center bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800">
              Persistencia Final
            </span>
          </div>
        </div>

        <div className="lg:hidden flex flex-col gap-8">
          <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
            <h3 className="text-white font-bold mb-2">
              Vista de Escritorio Recomendada
            </h3>
            <p className="text-zinc-400 text-sm">
              Abre esta página en una pantalla grande para ver el diagrama de
              arquitectura interactivo en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
