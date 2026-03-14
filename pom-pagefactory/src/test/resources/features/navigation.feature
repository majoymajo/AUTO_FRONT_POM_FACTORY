Feature: Navegación entre secciones de Sofkianos MVP

  Como usuario de Sofkianos MVP
  Quiero navegar fluídamente entre la landing, el formulario de envío y la exploración de kudos
  Para acceder a las funcionalidades del sistema de forma intuitiva

  Scenario: El usuario navega desde la landing hacia la exploración de kudos
    Given el usuario se encuentra en la landing page de Sofkianos
    When selecciona "Explorar Kudos" en la barra de navegación
    Then accede a la página de exploración de kudos

  Scenario: El usuario navega desde la landing hacia el envío de kudos
    Given el usuario se encuentra en la landing page de Sofkianos
    When selecciona "Acceder" en la barra de navegación
    Then accede al formulario de envío de kudos

  @skip
  Scenario: El usuario regresa a la landing desde la exploración de kudos
    Given el usuario se encuentra en la página de exploración de kudos
    When selecciona el logo de SofkianOS en la barra de navegación
    Then regresa a la landing page principal

