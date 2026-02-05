import React from 'react';
import { MainLayout } from '../../components';
import { useHomeForm } from '../../hooks/forms/useHomeForm';

export const Home: React.FC = () => {
  const { inputValue, handleInputChange, handleSubmit } = useHomeForm();

  return (
    <MainLayout
      heroTitle="HERO"
      inputValue={inputValue}
      inputPlaceholder="Input Text"
      buttonLabel="Btn"
      footerText="FOOTER"
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
};

export default Home;
