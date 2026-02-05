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
        heroTitle="Envía tus Kudos ✨"
        heroSubtitle="Reconoce y celebra el gran trabajo de tu equipo"
        inputValue={inputValue}
        inputPlaceholder="Escribe tu mensaje de reconocimiento aquí..."
        buttonLabel={isSubmitting ? "Enviando..." : "Enviar Kudo"}
        footerText="Kudos Sofkianos"
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
