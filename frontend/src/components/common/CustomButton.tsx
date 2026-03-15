import React from "react";

/**
 * Props del componente CustomButton.
 *
 * @interface CustomButtonProps
 * @property {string} [label='Btn'] - Texto a mostrar en el botón si no se proporcionan children.
 * @property {(e: React.MouseEvent<HTMLButtonElement>) => void} [onClick] - Función manejadora del evento click.
 * @property {'button' | 'submit' | 'reset'} [type='button'] - Tipo HTML del botón.
 * @property {'primary' | 'secondary' | 'outline'} [variant='primary'] - Variante visual del botón.
 * @property {'small' | 'medium' | 'large'} [size='medium'] - Tamaño del botón.
 * @property {boolean} [disabled=false] - Si el botón está deshabilitado.
 * @property {boolean} [loading=false] - Si el botón está en estado de carga (muestra spinner).
 * @property {string} [icon] - Clase CSS del icono a mostrar (ej: 'lucide-icon').
 * @property {string} [className=''] - Clases CSS adicionales personalizadas.
 * @property {React.ReactNode} [children] - Contenido personalizado del botón (prioridad sobre label).
 */
interface CustomButtonProps {
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Componente de botón reutilizable y personalizable.
 *
 * Botón con múltiples variantes visuales, tamaños y estados (disabled, loading).
 * Incluye animaciones de hover, active y focus, gradientes de color según la marca,
 * y soporte para iconos y estados de carga.
 *
 * Variantes disponibles:
 * - **primary**: Gradiente naranja (marca principal), con sombras naranja.
 * - **secondary**: Gradiente azul cielo, con sombras azul.
 * - **outline**: Borde naranja transparente, cambia a relleno en hover.
 *
 * Tamaños disponibles:
 * - **small**: px-4 py-2, texto pequeño.
 * - **medium**: px-6 py-3, texto base (por defecto).
 * - **large**: px-8 py-4, texto grande.
 *
 * Estados:
 * - **loading**: Muestra spinner animado, deshabilita el botón.
 * - **disabled**: Reduce opacidad, deshabilita interacción y animaciones.
 *
 * Animaciones:
 * - Hover: Escala 105%, sombras más intensas, gradientes más oscuros.
 * - Active: Escala 95% para efecto de presión.
 * - Focus: Ring naranja con blur.
 *
 * @component
 * @param {CustomButtonProps} props - Props del componente.
 * @returns {JSX.Element} Botón estilizado con variantes y estados.
 *
 * @example
 * ```tsx
 * // Botón primario básico
 * <CustomButton label="Enviar" onClick={handleSubmit} />
 * ```
 *
 * @example
 * ```tsx
 * // Botón con estado de carga
 * <CustomButton
 *   variant="primary"
 *   size="large"
 *   loading={isSubmitting}
 *   type="submit"
 * >
 *   Procesar Pago
 * </CustomButton>
 * ```
 *
 * @example
 * ```tsx
 * // Botón outline con icono personalizado
 * <CustomButton
 *   variant="outline"
 *   icon="lucide-trash"
 *   onClick={handleDelete}
 *   disabled={!canDelete}
 * >
 *   Eliminar
 * </CustomButton>
 * ```
 */
export const CustomButton: React.FC<CustomButtonProps> = ({
  label = "Btn",
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  className = "",
  children,
}) => {
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-600/60",
    secondary:
      "bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:from-sky-500 hover:to-sky-600 shadow-lg shadow-sky-400/50",
    outline:
      "bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white shadow-lg shadow-orange-400/30 hover:shadow-orange-400/60",
  };

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-xl
        font-bold
        transform
        transition-all
        duration-300
        hover:scale-105
        active:scale-95
        focus:outline-none
        focus:ring-4
        focus:ring-orange-400/50
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {icon && <span className={icon} />}
      {children || label}
    </button>
  );
};
