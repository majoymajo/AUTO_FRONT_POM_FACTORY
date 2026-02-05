import React from 'react';
import { Button } from 'primereact/button';

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
    primary: 'bg-white text-black hover:bg-gray-200',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <Button
      type={type}
      label={children || label}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-lg
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-white
        focus:ring-offset-2
        focus:ring-offset-black
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
};
