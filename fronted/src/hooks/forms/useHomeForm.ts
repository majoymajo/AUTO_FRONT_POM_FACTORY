import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

interface UseHomeFormReturn {
  inputValue: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  resetForm: () => void;
}

export const useHomeForm = (): UseHomeFormReturn => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with value:', inputValue);
    // Add your form submission logic here
    // e.g., API call, validation, etc.
  };

  const resetForm = () => {
    setInputValue('');
  };

  return {
    inputValue,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};
