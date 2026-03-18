Feature: Listado público de Kudos con filtros y paginación

  Como usuario de Sofkianos MVP
  Quiero explorar los reconocimientos otorgados en la organización
  Para descubrir el impacto de la cultura de reconocimiento

  Historia de usuario: US-012

  Scenario: El usuario cambia el orden de los kudos por fecha
    Given el usuario se encuentra en la página de exploración de kudos
    When cambia la dirección de ordenamiento
    Then el indicador de orden refleja la nueva dirección

  @skip
  Scenario: El botón de página anterior se deshabilita en la primera página
    Given el usuario se encuentra en la primera página de resultados
    Then el botón de página anterior está deshabilitado

