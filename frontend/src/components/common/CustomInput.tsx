import React from "react";

/**
 * Props del componente CustomInput.
 *
 * @interface CustomInputProps
 * @property {string} [id] - ID HTML del textarea para asociar con label.
 * @property {string} [name] - Atributo name del textarea para formularios.
 * @property {string} [value] - Valor controlado del textarea.
 * @property {string} [placeholder='Input Text'] - Texto placeholder del textarea.
 * @property {string} [type] - Tipo de input (aunque se renderiza como textarea).
 * @property {(e: React.ChangeEvent<HTMLTextAreaElement>) => void} [onChange] - Handler del evento de cambio.
 * @property {string} [className=''] - Clases CSS adicionales personalizadas.
 * @property {string} [label] - Etiqueta opcional que se muestra encima del textarea.
 * @property {string} [error] - Mensaje de error a mostrar debajo del input.
 * @property {boolean} [disabled=false] - Si el textarea está deshabilitado.
 * @property {number} [rows=4] - Número de filas visibles del textarea.
 */
interface CustomInputProps {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
}

/**
 * Componente de entrada de texto tipo textarea con diseño premium y efectos visuales.
 *
 * Textarea personalizado con diseño glass-morphism, bordes animados, efectos de hover
 * y focus, validación visual de errores y decoraciones sutiles. Ideal para formularios
 * que requieren entrada de texto multilínea con estética moderna.
 *
 * Características visuales:
 * - **Glass-morphism**: Fondo semitransparente con backdrop-blur
 * - **Bordes animados**: Color naranja marca con transiciones suaves
 * - **Estados interactivos**:
 *   - Hover: Borde naranja más intenso, fondo ligeramente más opaco
 *   - Focus: Ring naranja difuminado, borde más brillante, cambio de color en label
 *   - Error: Bordes y ring rojos, mensaje de error animado con punto pulsante
 * - **Decoración**: Elemento decorativo en esquina superior derecha que se ilumina al enfocar
 * - **Animaciones**: Fade-in al montar, transiciones suaves de 500ms
 * - **Tipografía**: Texto grande (xl), label bold tracking-tight, placeholder sutil
 *
 * Accesibilidad:
 * - Label asociado mediante htmlFor/id
 * - Placeholder descriptivo
 * - Mensaje de error visible y semánticamente relevante
 *
 * @component
 * @param {CustomInputProps} props - Props del componente.
 * @returns {JSX.Element} Textarea estilizado con label y mensaje de error opcionales.
 *
 * @example
 * ```tsx
 * // Uso básico con label
 * <CustomInput
 *   id="descripcion"
 *   label="Descripción"
 *   placeholder="Escribe tu descripción aquí..."
 *   value={descripcion}
 *   onChange={(e) => setDescripcion(e.target.value)}
 *   rows={6}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Con validación y error
 * <CustomInput
 *   id="mensaje"
 *   name="mensaje"
 *   label="Tu Mensaje"
 *   value={mensaje}
 *   onChange={handleChange}
 *   error={errors.mensaje}
 *   disabled={isSubmitting}
 * />
 * ```
 */
export const CustomInput: React.FC<CustomInputProps> = ({
  id,
  name,
  value,
  placeholder = "Input Text",
  onChange,
  className = "",
  label,
  error,
  disabled = false,
  rows = 4,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-10 group">
      {label && (
        <label
          htmlFor={id}
          className="block text-white text-lg font-bold mb-4 ml-2 tracking-tight group-focus-within:text-orange-400 transition-colors duration-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`
            w-full 
            px-8
            py-6
            bg-slate-900/40
            backdrop-blur-2xl
            border-2 
            border-orange-500/20
            rounded-[2rem]
            text-white 
            text-xl
            placeholder-white/20
            font-light
            shadow-2xl
            shadow-orange-500/5
            focus:outline-none 
            focus:ring-4
            focus:ring-orange-500/20
            focus:border-orange-500/60
            focus:bg-slate-900/60
            hover:border-orange-400/40
            hover:bg-slate-900/50
            transition-all
            duration-500
            resize-none
            animate-fade-in
            ${error ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60" : ""}
            ${className}
          `}
        />

        {}
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-tr-[2rem] rounded-bl-[4rem] pointer-events-none transition-opacity duration-500 group-focus-within:bg-orange-500/10"></div>
      </div>

      {error && (
        <div className="flex items-center gap-3 mt-4 ml-4 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-red-400 text-sm font-bold tracking-wide">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};
