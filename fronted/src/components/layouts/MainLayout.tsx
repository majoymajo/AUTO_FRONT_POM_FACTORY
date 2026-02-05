import React from 'react';
import { Hero } from './Hero';
import { CustomInput } from '../common/CustomInput';
import { CustomButton } from '../common/CustomButton';
import { Footer } from './Footer';

interface MainLayoutProps {
  heroTitle?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  buttonLabel?: string;
  footerText?: string;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  error?: string | null;
  successMessage?: string | null;
  isLoading?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  heroTitle = 'HERO',
  inputValue = '',
  inputPlaceholder = 'Input Text',
  buttonLabel = 'Btn',
  footerText = 'FOOTER',
  onInputChange,
  onSubmit,
  className = '',
  error = null,
  successMessage = null,
  isLoading = false
}) => {
  return (
    <div className={`
      min-h-screen 
      bg-gradient-to-br 
      from-slate-900 
      via-slate-800 
      to-slate-900
      p-8
      ${className}
    `}>
      <main className="max-w-3xl mx-auto" role="main">
        <Hero title={heroTitle} />

        {/* Success Message */}
        {successMessage && (
          <div className="
            bg-gradient-to-r 
            from-green-500 
            to-emerald-500 
            text-white 
            p-4 
            rounded-xl 
            mb-6
            shadow-lg
            shadow-green-500/50
            animate-fade-in
            border-2
            border-green-300/20
          ">
            <p className="font-semibold text-center">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="
            bg-gradient-to-r 
            from-red-500 
            to-rose-500 
            text-white 
            p-4 
            rounded-xl 
            mb-6
            shadow-lg
            shadow-red-500/50
            animate-fade-in
            border-2
            border-red-300/20
          ">
            <p className="font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Form Section */}
        <section className="my-8" aria-label="Main Form">
          <form onSubmit={onSubmit} className="space-y-4">
            <CustomInput
              id="main-input"
              name="mainInput"
              value={inputValue}
              onChange={onInputChange}
              placeholder={inputPlaceholder}
            />

            <div className="flex justify-center">
              <CustomButton
                type="submit"
                label={buttonLabel}
                variant="outline"
                size="medium"
                loading={isLoading}
                disabled={isLoading}
              />
            </div>
          </form>
        </section>

        <Footer text={footerText} />
      </main>
    </div>
  );
};
