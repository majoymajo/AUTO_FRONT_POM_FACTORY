import React from 'react';


interface CustomButtonProps {
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  label = 'Btn',
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
  children
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-600/60',
    secondary: 'bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:from-sky-500 hover:to-sky-600 shadow-lg shadow-sky-400/50',
    outline: 'bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white shadow-lg shadow-orange-400/30 hover:shadow-orange-400/60'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
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
