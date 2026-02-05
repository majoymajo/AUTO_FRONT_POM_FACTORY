import React from 'react';
import { InputText } from 'primereact/inputtext';

interface CustomInputProps {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  id,
  name,
  value,
  placeholder = 'Input Text',
  type = 'text',
  onChange,
  className = '',
  label,
  error,
  disabled = false
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-white text-sm font-medium mb-2"
        >
          {label}
        </label>
      )}
      <InputText
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full 
          px-6
          py-4
          bg-white/10
          backdrop-blur-md
          border-2 
          border-orange-300/30
          rounded-xl
          text-white 
          placeholder-orange-200/50
          font-medium
          shadow-lg
          shadow-orange-500/10
          focus:outline-none 
          focus:ring-4
          focus:ring-orange-400/50
          focus:border-orange-400
          focus:bg-white/15
          focus:shadow-orange-500/30
          hover:border-orange-300/50
          transition-all
          duration-300
          ${error ? 'border-red-500 focus:ring-red-400/50' : ''}
          ${className}
        `}
      />
      {error && (
        <span className="text-red-400 text-sm mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
};
