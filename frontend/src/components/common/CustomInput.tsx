import React from 'react';


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

export const CustomInput: React.FC<CustomInputProps> = ({
  id,
  name,
  value,
  placeholder = 'Input Text',
  onChange,
  className = '',
  label,
  error,
  disabled = false,
  rows = 4
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
            ${error ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60' : ''}
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

