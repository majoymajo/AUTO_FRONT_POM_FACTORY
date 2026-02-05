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
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  heroTitle = 'HERO',
  inputValue = '',
  inputPlaceholder = 'Input Text',
  buttonLabel = 'Btn',
  footerText = 'FOOTER',
  onInputChange,
  onSubmit,
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-black p-8 ${className}`}>
      <main className="max-w-3xl mx-auto" role="main">
        <Hero title={heroTitle} />

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
              />
            </div>
          </form>
        </section>

        <Footer text={footerText} />
      </main>
    </div>
  );
};
