Feature: Envío de reconocimientos entre compañeros

  Como usuario de Sofkianos MVP
  Quiero enviar un reconocimiento (Kudo) a un compañero
  Para fortalecer la cultura de reconocimiento en la organización

  Scenario: El usuario accede al formulario de envío de kudos
    Given el usuario se encuentra en la landing page de Sofkianos
    When navega hacia la sección de envío de kudos
    Then se muestra el formulario de reconocimiento con los campos Remitente, Destinatario, Categoría y Mensaje

  Scenario: El usuario completa el formulario de envío de un kudo
    Given el usuario se encuentra en el formulario de envío de kudos
    When completa el formulario con remitente, destinatario, categoría y mensaje válidos
    Then se muestra la previsualización del avatar del destinatario
    And el control de envío por deslizamiento está visible

  Scenario: El sistema muestra un error cuando el envío falla
    Given el usuario ha completado el formulario de envío de kudos
    When el envío es rechazado por el servidor
    Then se muestra el banner de error con el detalle de los campos inválidos

  Scenario Outline: El formulario valida las categorías permitidas
    Given el usuario se encuentra en el formulario de envío de kudos
    When selecciona la categoría "<categoria>"
    Then la categoría "<categoria>" queda seleccionada en el formulario

    Examples:
      | categoria  |
      | Innovation |
      | Teamwork   |
      | Passion    |
      | Mastery    |
