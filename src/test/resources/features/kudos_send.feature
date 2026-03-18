Feature: Envío de reconocimientos entre compañeros

  Como usuario de Sofkianos MVP
  Quiero enviar un reconocimiento (Kudo) a un compañero
  Para fortalecer la cultura de reconocimiento en la organización

  Scenario: El usuario accede al formulario de envío de kudos
    Given el usuario se encuentra en la landing page de Sofkianos
    When navega hacia la sección de envío de kudos
    Then se muestra el formulario de reconocimiento con los campos Remitente, Destinatario, Categoría y Mensaje

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

