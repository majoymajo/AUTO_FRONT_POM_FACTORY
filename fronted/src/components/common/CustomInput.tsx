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
          px-4 
          py-3 
          bg-transparent 
          border-2 
          border-white 
          rounded-lg 
          text-white 
          placeholder-gray-400
          focus:outline-none 
          focus:ring-2 
          focus:ring-white 
          focus:border-transparent
          transition-all
          ${error ? 'border-red-500' : ''}
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
