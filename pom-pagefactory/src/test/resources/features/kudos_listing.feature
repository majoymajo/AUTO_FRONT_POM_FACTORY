Feature: Listado público de Kudos con filtros y paginación

  Como usuario de Sofkianos MVP
  Quiero explorar los reconocimientos otorgados en la organización
  Para descubrir el impacto de la cultura de reconocimiento

  Historia de usuario: US-012

  @skip
  Scenario: El usuario visualiza el listado de kudos al acceder a la página
    Given el usuario se encuentra en la página de exploración de kudos
    When la página termina de cargar
    Then se muestra la tabla de kudos con las columnas De, Para, Categoría, Mensaje y Fecha
    And se muestra el total de kudos encontrados

  Scenario: El usuario filtra kudos por categoría
    Given el usuario se encuentra en la página de exploración de kudos
    When filtra los kudos por la categoría "Teamwork"
    Then todos los kudos visibles pertenecen a la categoría "Teamwork"

  @skip
  Scenario: El usuario filtra kudos por texto de búsqueda
    Given el usuario se encuentra en la página de exploración de kudos
    When busca kudos con el texto "proyecto"
    Then los kudos visibles contienen "proyecto" en sus campos de texto

  @skip
  Scenario: El usuario filtra kudos por rango de fechas
    Given el usuario se encuentra en la página de exploración de kudos
    When filtra kudos desde "2026-02-01" hasta "2026-02-10"
    Then se muestran únicamente los kudos dentro del rango de fechas

  Scenario: El sistema valida que la fecha de inicio no sea posterior a la fecha de fin
    Given el usuario se encuentra en la página de exploración de kudos
    When ingresa una fecha de inicio posterior a la fecha de fin
    Then se muestra el mensaje de error "La fecha de inicio no puede ser posterior a la fecha de fin"

  @skip
  Scenario: El usuario limpia todos los filtros aplicados
    Given el usuario ha aplicado filtros en la lista de kudos
    When limpia los filtros
    Then se restablece la lista completa de kudos sin restricciones

  Scenario: El usuario cambia el orden de los kudos por fecha
    Given el usuario se encuentra en la página de exploración de kudos
    When cambia la dirección de ordenamiento
    Then el indicador de orden refleja la nueva dirección

  @skip
  Scenario: El usuario navega a la siguiente página de resultados
    Given el usuario se encuentra en la página de exploración de kudos
    And existen múltiples páginas de resultados
    When avanza a la siguiente página
    Then se actualiza el contenido de la tabla con los kudos de la nueva página
    And el indicador de paginación refleja la página actual

  Scenario: El botón de página anterior se deshabilita en la primera página
    Given el usuario se encuentra en la primera página de resultados
    Then el botón de página anterior está deshabilitado

  @skip
  Scenario: El sistema muestra un estado vacío cuando no hay resultados
    Given el usuario se encuentra en la página de exploración de kudos
    When aplica filtros que no coinciden con ningún kudo
    Then se muestra el mensaje "No se encontraron kudos"

  Scenario: El sistema muestra un estado de error cuando falla la carga
    Given el servicio de kudos no está disponible
    When el usuario accede a la página de exploración de kudos
    Then se muestra el mensaje "Error al cargar kudos"
    And se ofrece la opción de reintentar
