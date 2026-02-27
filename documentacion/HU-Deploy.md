# Historias de Usuario de Despliegue

---

## US-001: Refactorización y estandarización de los Dockerfile para seguridad y eficiencia

### 1. Definición de la HU

**Como** persona desarrolladora
**Quiero** refactorizar y estandarizar los Dockerfile de todos los servicios
**Para** garantizar imágenes seguras, eficientes y alineadas con las mejores prácticas

### 2. Especificaciones de Arquitectura y Despliegue

* **Capa de Clean Architecture:** Infraestructura
* **Patrón Aplicado:** Adaptadores de infraestructura, separación de build y runtime
* **Estrategia de Despliegue:** Rolling Update

### 3. Matriz de Calidad INVEST

| Criterio | Puntuación (0-3) | Justificación de la nota |
| :--- | :---: | :--- |
| **Independent** | 3 | Puede ejecutarse sin depender de otras historias |
| **Negotiable** | 3 | El enfoque de refactorización puede adaptarse |
| **Valuable** | 3 | Mejora seguridad y performance del producto |
| **Estimable** | 3 | Alcance claro y medible |
| **Small** | 2 | Puede requerir dividirse si hay muchos servicios |
| **Testable** | 3 | Se puede validar con linters y pruebas de build |

### 4. Validación (Gherkin)

* **Escenario:** Build seguro y eficiente de imágenes Docker
  * **Dado** que existen Dockerfile legacy en los servicios
  * **Cuando** se refactorizan y aplican buenas prácticas de seguridad y eficiencia
  * **Entonces** las imágenes resultantes pasan escaneo de vulnerabilidades y cumplen con los tiempos de build esperados

### 5. Definición de Hecho (DoD)

* [ ] Instalada en entornos de pre-producción.

* [ ] Pruebas de humo (Smoke Tests) superadas.
* [ ] Pruebas de regresión completadas.
* [ ] Dockerfile validados con linters y escáner de vulnerabilidades.

---

## US-002 Mejorar y versionar los archivos docker-compose para ambientes dev, test y prod

### 1. Definición de la HU

**Como** persona de operaciones
**Quiero** mejorar y versionar los archivos docker-compose para cada ambiente
**Para** facilitar despliegues consistentes y reproducibles en dev, test y prod

### 2. Especificaciones de Arquitectura y Despliegue

* **Capa de Clean Architecture:** Infraestructura
* **Patrón Aplicado:** Adaptadores de configuración, separación de ambientes
* **Estrategia de Despliegue:** Rolling Update

### 3. Matriz de Calidad INVEST

| Criterio | Puntuación (0-3) | Justificación de la nota |
| :--- | :---: | :--- |
| **Independent** | 3 | Cada ambiente puede mejorarse de forma aislada |
| **Negotiable** | 3 | Se puede ajustar la estructura de los archivos |
| **Valuable** | 3 | Reduce errores y acelera despliegues |
| **Estimable** | 3 | Alcance claro y delimitado |
| **Small** | 3 | Puede completarse en un sprint |
| **Testable** | 3 | Se valida con despliegues en cada ambiente |

### 4. Validación (Gherkin)

* **Escenario:** Despliegue reproducible por ambiente
  * **Dado** que existen archivos docker-compose desactualizados
  * **Cuando** se actualizan y versionan para dev, test y prod
  * **Entonces** los servicios se despliegan correctamente en cada ambiente sin errores de configuración

### 5. Definición de Hecho (DoD)

* [ ] Instalada en entornos de pre-producción.

* [ ] Pruebas de humo (Smoke Tests) superadas.
* [ ] Pruebas de regresión completadas.
* [ ] Versionado y documentación de los archivos docker-compose.

---

## US-003 Automatizar pruebas de integración y smoke tests post-despliegue

### 1. Definición de la HU

**Como** persona de QA
**Quiero** automatizar pruebas de integración y smoke tests post-despliegue
**Para** validar la estabilidad y funcionalidad básica tras cada despliegue

### 2. Especificaciones de Arquitectura y Despliegue

* **Capa de Clean Architecture:** Núcleo (Use Cases) / Infraestructura
* **Patrón Aplicado:** Adaptadores de testing, integración en pipeline
* **Estrategia de Despliegue:** Rolling Update

### 3. Matriz de Calidad INVEST

| Criterio | Puntuación (0-3) | Justificación de la nota |
| :--- | :---: | :--- |
| **Independent** | 3 | Puede implementarse sin bloquear otras tareas |
| **Negotiable** | 3 | Se puede ajustar el alcance de las pruebas |
| **Valuable** | 3 | Reduce riesgos de regresión y fallos en producción |
| **Estimable** | 3 | Alcance claro y medible |
| **Small** | 3 | Implementable en un sprint |
| **Testable** | 3 | Se valida con reportes automáticos de pruebas |

### 4. Validación (Gherkin)

* **Escenario:** Pruebas automáticas post-despliegue
  * **Dado** que se realiza un despliegue en cualquier ambiente
  * **Cuando** se ejecutan pruebas de integración y smoke tests
  * **Entonces** se reportan resultados y se bloquea la promoción si hay fallos críticos

### 5. Definición de Hecho (DoD)

* [ ] Instalada en entornos de pre-producción.

* [ ] Pruebas de humo (Smoke Tests) superadas.
* [ ] Pruebas de regresión completadas.
* [ ] Reportes de pruebas integrados al pipeline.

---

## US-004 Refactorización a Clean Architecture: producer-api

### 1. Diagnóstico del Monolito

* **Problema detectado:** Lógica de orquestación y validación estaba mezclada con detalles de mensajería (RabbitMQ) y DTOs en servicios Spring.
* **Contexto:** El microservicio `producer-api` mantiene una arquitectura tradicional.

### 2. Historia de Usuario de Refactorización

**Como** Arquitecto de Software
**Quiero** extraer la lógica de publicación y validación a casos de uso y puertos independientes dentro del `producer-api`
**Para** desacoplar el dominio de la infraestructura, facilitar las pruebas y establecer un estándar técnico para el resto del sistema

### 3. Diseño de Clean Architecture

* **Capa Destino:** Domain (entidades, puertos in/out), Application (casos de uso), Infrastructure (adaptadores, RabbitMQ)
* **Puertos implementados:** `KudoEventPublisher` (Out Port), `KudoValidationStrategy` (In Port)
* **Patrón de Despliegue:** Refactorización paralela y reemplazo de dependencias, manteniendo las rutas API actuales transparentes.

### 4. Matriz INVEST

| Criterio        | Puntos (0-3) | Observación |
| :---            | :---:        | :--- |
| **Independent** | 3            | Puede migrarse por flujo (publicación, validación) |
| **Negotiable**  | 3            | Alcance y orden de migración ajustables |
| **Valuable**    | 3            | Mejora mantenibilidad y calidad |
| **Estimable**   | 2            | Alcance claro, pero posible ajuste por dependencias |
| **Small**       | 2            | Puede dividirse por caso de uso |
| **Testable**    | 3            | Pruebas unitarias y de integración posibles |

### 5. Criterios de Aceptación (Gherkin)

* **Escenario:** Migración exitosa de la lógica de publicación de Kudos
  * **Dado** que la lógica reside en el núcleo limpio
  * **Cuando** se invoca a través del puerto definido
  * **Entonces** el resultado es idéntico al sistema anterior y las rutas API no cambian.

### 6. Definición de Hecho (DoD)

* [ ] Código refactorizado sigue el principio de Inversión de Dependencias.
* [ ] Pruebas de regresión en pre-producción comparando Monolito vs Clean.
* [ ] Cobertura de pruebas unitarias en el Núcleo > 90%.

---

## US-005 Pipeline CI/CD del Frontend

### 1. Definición de la HU

**Como** persona desarrolladora o de operaciones
**Quiero** automatizar la integración y despliegue continuo (CI/CD) del Frontend
**Para** garantizar la calidad del código, compilar imágenes Docker y desplegar de forma segura en AWS EC2, de manera independiente del backend.

### 2. Especificaciones de Arquitectura y Despliegue

* **Capa de Arquitectura:** Infraestructura (CI/CD Pipeline)
* **Herramientas:** GitHub Actions, Node.js 20, ESLint, Vitest, Trivy, Docker Buildx, AWS EC2, Appleboy SSH Action, Docker Compose.
* **Flujo (Jobs):**
  1. `test`: Pasa ESLint, instala dependencias cacheadas y asegura cobertura con Vitest en Node.js 20.
  2. `docker-build`: Construye la imagen multi-stage (Node -> Nginx), escanea vulnerabilidades del contenedor final con `Trivy` y sube la imagen a Docker Hub vinculada al commit-sha.
  3. `deploy`: Se conecta por SSH a EC2, hace pull de la imagen frontal y recrea su contenedor (sin afectar backend con `--no-deps`).

### 3. Matriz de Calidad INVEST

| Criterio | Puntuación (0-3) | Justificación de la nota |
| :--- | :---: | :--- |
| **Independent** | 3 | Desacoplado del backend mediante path filtering en GitHub Actions. |
| **Negotiable** | 3 | Los pasos de linting y testing son modulares y ajustables. |
| **Valuable** | 3 | Automatiza el aseguramiento de calidad y unifica el proceso de pase a producción. |
| **Estimable** | 3 | Triggers, pasos y secrets claramente identificados en el archivo `.yml`. |
| **Small** | 3 | El pipeline cubre solo el ciclo de vida del frontend React. |
| **Testable** | 3 | Generación de reportes de Vitest/ESLint y logs de despliegue SSH evaluables por ejecución. |

### 4. Validación (Gherkin)

* **Escenario:** Deploy condicional exitoso a entorno Cloud
  * **Dado** un push a la rama `main` con cambios en el directorio `frontend/` (omitiendo documentación)
  * **Cuando** el workflow ejecuta exitosamente la instalación de dependencias exactas (`npm ci`), lint, y unit tests
  * **Entonces** se construye y sube la imagen Docker con caché (`type=gha`), y se actualiza el contenedor frontend vía SSH sobre EC2.

### 5. Definición de Hecho (DoD)

* [x] Ejecución de Linter para Node/React pasando sin errores.
* [x] Ejecución exitosa de Vitest unit testing y upload de su coverage.
* [x] Imagen Docker construida, validada, y tageada con `latest` y `sha` en DockerHub.
* [x] Despliegue ejecutado en servidor EC2 reconstruyendo exclusivamente el contenedor `frontend` y mostrando contenedores en ejecución.

---

## US-006 Dockerización Multi-Stage del Frontend

### 1. Definición de la HU

**Como** persona de operaciones
**Quiero** dockerizar la aplicación frontend utilizando un build multi-stage
**Para** compilar el código fuente aislado y servir estáticos de forma ultraligera en producción.

### 2. Especificaciones de Arquitectura y Despliegue

* **Capa de Arquitectura:** Infraestructura (Contenedores)
* **Herramientas:** Docker, Node.js 20 (Alpine), Nginx (Alpine).
* **Estrategia de Despliegue:** Multi-Stage Build estático.

### 3. Matriz de Calidad INVEST

| Criterio | Puntuación (0-3) | Justificación de la nota |
| :--- | :---: | :--- |
| **Independent** | 3 | Completamente autocontenido, la compilación de la imagen no exige correr dependencias. |
| **Negotiable** | 2 | Posibilidad de cambiar parámetros estáticos del Nginx, pero se sigue un patrón rígido de frontend. |
| **Valuable** | 3 | Reduce radicalmente el peso y la superficie de vulnerabilidad eliminando el runtime de Node en prod. |
| **Estimable** | 3 | Acotado a un `Dockerfile` de 14 líneas de rápida ejecución. |
| **Small** | 3 | Solo incluye la descarga de dependencias, transpilación y servidor Nginx. |
| **Testable** | 3 | La imagen se puede instanciar localmente testeando el puerto resultante 5173. |

### 4. Validación (Gherkin)

* **Escenario:** Construcción de imagen mínima usando Nginx Server
  * **Dado** el código fuente React sin compilar en el directorio `frontend/`
  * **Cuando** se ejecuta `docker build` en el entorno automatizado
  * **Entonces** la etapa `builder` transfiere la carpeta `dist` al entorno de `nginx:alpine`, configurando Nginx y arrancando con modo daemon offline.

### 5. Definición de Hecho (DoD)

* [x] Instalación de dependencias realizada como capa independiente en etapa de constructora.
* [x] Imagen final carente de runtime de Node y código fuente base.
* [x] Configuración embebida vía `nginx.conf`.
* [x] Exposición del puerto 5173 funcional mediante script inicial predefinido.

---

## US-007 Pipeline CI/CD del Backend (API & Worker)

### 1. Definición de la HU

**Como** persona desarrolladora o de operaciones
**Quiero** automatizar la integración y despliegue de los microservicios Backend
**Para** garantizar su compilación con Maven, testing con Testcontainers y actualización paralela sobre EC2 sin interrumpir al frontend.

### 2. Especificaciones de Arquitectura y Despliegue

* **Capa de Arquitectura:** Infraestructura (CI/CD Backend Java)
* **Herramientas:** GitHub Actions, JDK 17 (Temurin), Maven cache, Testcontainers, Trivy, Docker Buildx, AWS EC2, Appleboy SSH Action.
* **Flujo (Jobs):**
  1. `test`: Ejecuta paralelamente dependencias cacheadas y corre tests unitarios/integración vía Testcontainers en ambos microservicios (Producer + Consumer).
  2. `docker-build`: Recompila las versiones JAR multiestadio a imágenes Docker independientes, escaneando el runtime final de ambas con `Trivy` y enviándolas a Hub.
  3. `deploy`: Accede a EC2 para detener y recrear las capas de servicios `producer-api` y `consumer-worker` exclusivamente.

### 3. Matriz de Calidad INVEST

| Criterio | Puntuación (0-3) | Justificación de la nota |
| :--- | :---: | :--- |
| **Independent** | 3 | Excluye cambios de UI, activándose de forma específica en directorios `producer-api` y `consumer-worker`. |
| **Negotiable** | 3 | La paralelización o las versiones de Java son configurables. |
| **Valuable** | 3 | Garantiza el estándar JVM y pruebas de integración antes del lanzamiento productivo. |
| **Estimable** | 2 | Tiempos de pipeline más variables debido a Maven y Testcontainers. |
| **Small** | 2 | Consolida 2 microservicios en un pipeline por eficiencia. |
| **Testable** | 3 | Los fallos de Testcontainers o pruebas unitarias bloquean explícitamente el paso de construcción. |

### 4. Validación (Gherkin)

* **Escenario:** Pipeline condicionado a pruebas Maven e Integración
  * **Dado** un cambio en el código fuente de cualquiera de los microservicios Java (excluyendo markdown)
  * **Cuando** se reporta un push a `main` desencadenando pruebas con Jacoco/Surefire y Testcontainers en producer
  * **Entonces** las imágenes Docker de producer y consumer se compilan vía Buildx y suben a DockerHub, actualizando solo los contenedores de backend correspondientes en producción.

### 5. Definición de Hecho (DoD)

* [x] Uso de JDK 17 Temurin y caché preconfigurada para repositorio `~/.m2`.
* [x] Pruebas unitarias sobre `consumer-worker` e integración sobre `producer-api` superadas.
* [x] Artifacts estáticos Jacoco/Surefire generados y resguardados.
* [x] Empleo de caché bidireccional `type=gha` en la acción build/push hacia DockerHub.
* [x] Deploy desplegado recreando servicios sin derribar el esquema local.

---

## US-008 Dockerización Segura Multi-Stage de Microservicios Backend en Java

### 1. Definición de la HU

**Como** persona de operaciones
**Quiero** dockerizar el Producer API y el Consumer Worker mediante un enfoque de empaquetado optimizado
**Para** asegurar imágenes ligeras, seguras (usuario sin privilegios) con monitoreo interno en tiempo de ejecución.

### 2. Especificaciones de Arquitectura y Despliegue

* **Capa de Arquitectura:** Infraestructura (Contenedores Java)
* **Herramientas:** Docker, Eclipse Temurin 17 (JDK para builder y JRE para runtime final), Maven Wrapper, user namespaces.
* **Estrategia de Despliegue:** Optimización con empaquetado limpio offline y securización básica con `appuser`.

### 3. Matriz de Calidad INVEST

| Criterio | Puntuación (0-3) | Justificación de la nota |
| :--- | :---: | :--- |
| **Independent** | 3 | Diseño estructurado aplicable en entornos Java limpios. |
| **Negotiable** | 3 | Se pueden intercambiar scripts de Healthcheck o flags de Maven fácilmente. |
| **Valuable** | 3 | Protege de vulnerabilidades impidiendo enrutamientos al root. |
| **Estimable** | 3 | Tarea estándar repetible bajo un patrón transparente y observable. |
| **Small** | 3 | Los Dockerfile no superan las 50 líneas, focalizando su utilidad. |
| **Testable** | 3 | Directiva `HEALTHCHECK` autodiagnostica continuamente el framework en los respectivos puertos. |

### 4. Validación (Gherkin)

* **Escenario:** Procesamiento y empaquetado optimizado para Alpine JRE
  * **Dado** el código fuente Java con su wrapper provisto en los microservicios de backend
  * **Cuando** la fase build instala herramientas (dos2unix, wget) y abstrae `dependency:go-offline` mitigando problemas de línea
  * **Entonces** se compila con JDK excluyendo empaquetado redundante, derivando únicamente el JAR final a JRE inmutable, ejecutando en cuenta no privilegiada `appuser` su estado del sistema.

### 5. Definición de Hecho (DoD)

* [x] Normalización CRLF y precacheo de plugins descargados pre-compilación completos en la primera fase.
* [x] Empleo estricto de una imagen runtime `jre-alpine` desprovista de utilidades JDK/Maven.
* [x] Proceso atado e iniciado por usuario asignado dinámicamente (`appuser` UID 1000).
* [x] Control de salud definido por invocaciones locales de ruta HTTP vacía (`wget /dev/null`) a los endpoints configurados.

---

## US-009 Migración a Clean Architecture y Estabilización: consumer-worker

### 1. Diagnóstico del Monolito Activo

* **Problema detectado:** Aunque el `consumer-worker` aloja el endpoint `GET` (logrando CQRS a nivel microservicio), su lógica interna sigue fuertemente acoplada. El `KudoServiceImpl` depende directamente de Entidades JPA (`com.sofkianos.consumer.entity.Kudo`) y de modelos de paginación de Spring Data (`Page`, `Pageable`).
* **Contexto:** Al igual que ocurría históricamente con el `producer-api`, este acoplamiento viola la Inversión de Dependencias, dificultando aislar las reglas de negocio en pruebas unitarias puras y atando el núcleo al framework de BD.
* **Riesgo:** Alta fragilidad ante cambios de persistencia y baja mantenibilidad a largo plazo.

### 2. Historia de Usuario de Migración

**Como** Arquitecto de Software
**Quiero** extraer la lógica de persistencia, consultas y mensajería a casos de uso y puertos independientes (Clean Architecture) dentro del `consumer-worker`
**Para** desacoplar el dominio de la infraestructura (Spring Data / RabbitMQ) y estandarizar este servicio bajo el mismo nivel de calidad del `producer-api`.

### 3. Diseño de Clean Architecture

* **Capa Destino:** Domain (entidades puras `Kudo`, puertos in/out), Application (casos de uso segregados: `KudoQueryUseCase`, `KudoCommandUseCase`), Infrastructure (adaptadores web/rest, adaptadores JPA, listeners RabbitMQ).
* **Puertos previstos:** Interfaz `KudoPersistencePort` retornando tipos primitivos/dominio puro, eliminando referencias a `org.springframework.data.domain.Page`.
* **Patrón de Despliegue:** Refactorización interna progresiva asegurando la inmutabilidad de la API actual.

### 4. Matriz INVEST

| Criterio        | Puntos (0-3) | Observación |
| :---            | :---:        | :--- |
| **Independent** | 3            | Aislable del flujo principal de creación de datos (Commands). |
| **Negotiable**  | 3            | La migración de atributos paginados puede implementarse gradualmente. |
| **Valuable**    | 3            | Termina de desvincular el Producer, mejorando el escalado en lectura independiente del escalado de escritura. |
| **Estimable**   | 3            | El esfuerzo es predecible tomando el código del Producer como referencia. |
| **Small**       | 2            | Migrar BD y Endpoint tomará un sub-ciclo entero o sprint mediano. |
| **Testable**    | 3            | La capa Testcontainers ya existente garantiza pruebas unitarias transparentes. |

### 5. Criterios de Aceptación (Gherkin)

* **Escenario:** Inversión de Control exitosa y exposición de lectura (Query Endpoint)
  * **Dado** que el `consumer-worker` ha sido reestructurado hacia núcleos limpios (`domain`/`application`)
  * **Cuando** el usuario ejecuta un `GET` a las rutas de paginación (`/api/v1/kudos?page=0&size=20`) sobre este microservicio
  * **Entonces** la aplicación procesa la petición a través de sus nuevos RestControllers delegados a casos de uso In/Out y responde con el listado idéntico al provisto por el anterior monolito.

### 6. Definición de Hecho (DoD)

* [x] Directivas de JPA totalmente aisladas en los adaptadores *driven/out*.
* [x] Endpoint `GET` funcional y consumido exitosamente.
* [x] Pipeline CI y Testcontainers ejecutándose de manera verde con el nuevo set de tests unitarios del Core.
* [x] Código migrado respeta estricta nomenclatura y carpetas de Clean Architecture (`domain`, `application`, `infrastructure`).
