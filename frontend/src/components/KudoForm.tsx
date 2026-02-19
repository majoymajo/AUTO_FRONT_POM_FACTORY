import React from "react";
import { Send, User, ChevronRight, CheckCircle2 } from "lucide-react";
import { useKudoForm } from "../hooks/forms/useKudoForm";

/**
 * Clases base de Tailwind CSS para los campos de entrada del formulario.
 * Incluye estilos de fondo, borde, texto, placeholder y estados de foco.
 * @constant {string}
 */
const inputBase =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-zinc-100 " +
  "placeholder-zinc-600 focus:outline-none focus:border-brand " +
  "focus:bg-zinc-900/50 focus:ring-1 focus:ring-brand transition-all duration-300 appearance-none";

/**
 * Clases base de Tailwind CSS para las etiquetas de los campos del formulario.
 * Aplica tipografía pequeña, mayúsculas, espaciado y color de marca.
 * @constant {string}
 */
const labelBase =
  "block text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1.5 ml-1";

/**
 * Componente de formulario para enviar kudos entre usuarios.
 *
 * Renderiza un formulario interactivo tipo glass-morphism que permite a los usuarios
 * crear y enviar kudos (reconocimientos) a otros compañeros. El formulario incluye:
 * - Selector de remitente (quién envía el kudo)
 * - Selector de destinatario con previsualización de avatar en tiempo real
 * - Selector de categoría del kudo
 * - Área de texto para el mensaje personalizado
 * - Control deslizante (slider) innovador para confirmar el envío
 * - Manejo de errores del servidor con mensajes detallados por campo
 *
 * El componente usa el hook {@link useKudoForm} para toda la lógica de estado,
 * validación, efectos y submit. La interfaz responde a estados de carga,
 * errores de validación y confirmación visual mediante animaciones.
 *
 * @component
 * @returns {JSX.Element} Formulario de envío de kudos con interfaz glass-morphism.
 *
 * @example
 * ```tsx
 * import { KudoFormSystem } from './components/KudoForm';
 *
 * function App() {
 *   return <KudoFormSystem />;
 * }
 * ```
 */
export const KudoFormSystem: React.FC = () => {
  const {
    sliderValue,
    isDragging,
    loadingAvatar,
    sliderRef,
    register,
    serverErrors,
    formData,
    toUser,
    USERS,
    KUDO_CATEGORIES,
    handleStart,
  } = useKudoForm();

  return (
    <section className="min-h-[90vh] flex items-start justify-center pt-2 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-zinc-950 -z-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] -z-10 rounded-full opacity-40 pointer-events-none" />

      {/* Glass Container */}
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="
            relative
            backdrop-blur-sm 
            bg-zinc-900/40 
            rounded-2xl 
            border border-white/5
            shadow-2xl
            p-5
            space-y-4
        "
        >
          {/* Field: From */}
          <div className="group">
            <label className={labelBase}>De (Remitente)</label>
            <div className="relative">
              <select {...register("from")} className={inputBase}>
                <option value="">¿Quién eres?</option>
                {USERS.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Field: To + Identity Preview */}
          <div>
            <label className={labelBase}>Para (Destino)</label>
            <div className="flex gap-4 items-center">
              {/* Select Field */}
              <div className="relative flex-1">
                <select
                  {...register("to")}
                  className={`${inputBase} h-[5.5rem]`}
                >
                  <option value="">Selecciona compañero...</option>
                  {USERS.map((u) => (
                    <option key={u.id} value={u.email}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <User className="w-5 h-5" />
                </div>
              </div>

              {/* Identity Frame */}
              <div className="relative flex-shrink-0">
                <div
                  className={`
                    w-[5.5rem] h-[5.5rem] rounded-xl overflow-visible border 
                    flex items-center justify-center relative
                    transition-all duration-500
                    ${
                      loadingAvatar
                        ? "border-[#FF5F00] bg-zinc-900/80"
                        : toUser
                          ? "border-green-500/50 bg-zinc-900/50"
                          : "border-white/5 bg-zinc-900/50"
                    }
                  `}
                >
                  {/* Avatar Wrapper */}
                  <div className="w-full h-full rounded-xl overflow-hidden relative z-10">
                    {loadingAvatar ? (
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-pulse flex items-center justify-center">
                        <User className="w-8 h-8 text-zinc-600 animate-bounce opacity-50" />
                      </div>
                    ) : toUser ? (
                      <img
                        src={toUser.avatar}
                        alt="Identity"
                        className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-zinc-700" />
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  {toUser && !loadingAvatar && (
                    <div className="absolute -bottom-3 -right-3 z-20 animate-in zoom-in duration-300 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                      <CheckCircle2 className="w-9 h-9 text-green-500 fill-green-500 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Field: Category */}
          <div className="group">
            <label className={labelBase}>Categoría</label>
            <div className="relative">
              <select {...register("category")} className={inputBase}>
                <option value="">Selecciona valor...</option>
                {KUDO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </div>
            </div>
          </div>

          {/* Field: Message */}
          <div>
            <div className="flex items-center justify-between">
              <label className={labelBase}>Mensaje</label>
              <span
                className={`text-[10px] tabular-nums mr-1 ${(formData.message?.length ?? 0) < 10 ? "text-zinc-500" : "text-zinc-600"}`}
              >
                {formData.message?.length ?? 0}/500
              </span>
            </div>
            <textarea
              {...register("message")}
              rows={3}
              placeholder="Escribe tu mensaje..."
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* Server Error Banner */}
          {serverErrors && serverErrors.length > 0 && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="text-red-400 mt-0.5">⚠️</div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-red-300 uppercase tracking-wider">
                    No pudimos enviar tu Kudo
                  </p>
                  <ul className="text-[11px] text-red-400 font-medium leading-relaxed list-disc pl-3 space-y-0.5">
                    {serverErrors.map((err, idx) => (
                      <li key={idx}>
                        <span className="text-red-200 font-semibold">
                          {err.field}:
                        </span>{" "}
                        {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Group: Slider Submit */}
          <div className="pt-2">
            <div
              ref={sliderRef}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              className="relative h-12 w-full rounded-full bg-zinc-900/60 border border-white/5 shadow-inner overflow-hidden cursor-pointer group select-none transition-all hover:border-white/10"
            >
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <span
                  className={`text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase transition-opacity duration-300 ${sliderValue > 20 ? "opacity-0" : "opacity-100"}`}
                >
                  Desliza para enviar
                </span>
              </div>

              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r from-brand/20 to-brand/40 ${!isDragging && "transition-all duration-300"}`}
                style={{ width: `${sliderValue}%` }}
              />

              <div
                className={`absolute top-1 bottom-1 w-16 rounded-full bg-brand 

                    flex items-center justify-center text-white
                    shadow-[0_0_15px_rgba(255,95,0,0.4)] border border-[#FF8F4D]
                    ${!isDragging && "transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)"}
                    z-10 hover:scale-105 active:scale-95`}
                style={{ left: `${sliderValue}%` }}
              >
                <Send
                  className={`w-4 h-4 ${sliderValue > 90 ? "animate-ping" : ""}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KudoFormSystem;
