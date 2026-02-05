import React from 'react';
import { MainLayout } from '../../components';
import { useHomeForm } from '../../hooks/forms/useHomeForm';

export const Home: React.FC = () => {
  const { 
    inputValue, 
    handleInputChange, 
    handleSubmit, 
    isSubmitting,
    error,
    successMessage
  } = useHomeForm();

  return (
    <>
      <MainLayout
        heroTitle="Kudos"
        inputValue={inputValue}
        inputPlaceholder="Escribe tu mensaje de reconocimiento"
        buttonLabel={isSubmitting ? "Enviando..." : "Enviar"}
        footerText="Kudos"
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        successMessage={successMessage}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default Home;
