import React from 'react';
import { Hero } from './Hero';
import { CustomInput } from '../common/CustomInput';
import { CustomButton } from '../common/CustomButton';
import { Footer } from './Footer';
import { KudosList } from './KudosList';

interface MainLayoutProps {
  heroTitle?: string;
  heroSubtitle?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  buttonLabel?: string;
  footerText?: string;
  onInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  error?: string | null;
  successMessage?: string | null;
  isLoading?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  heroTitle = 'HERO',
  heroSubtitle,
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
      bg-pattern
      p-8
      ${className}
    `}>
      <main className="max-w-5xl mx-auto" role="main">
        <Hero title={heroTitle} subtitle={heroSubtitle} />

        {}
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

        {}
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

        {}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
          <div className="text-orange-400 text-2xl"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
        </div>

        {}
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

        <KudosList />

        <Footer text={footerText} />
      </main>
    </div>
  );
};
