# 🧪 Plan de Pruebas — Despliegue e Infraestructura

**Fecha de creación**: 26 de febrero de 2026
**Historia(s) base**: US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008

---

## 📋 Índice de Tests

| Completado | ID Test | Capa | Prioridad | Historia | Descripción |
|------------|---------|------|-----------|----------|-------------|
| [ ] | TC-001 | Backend | 🔴 CRÍTICA | US-001 | Build seguro de imágenes Docker sin vulnerabilidades críticas |
| [ ] | TC-002 | Backend | 🔴 CRÍTICA | US-002 | Despliegue reproducible por ambiente (dev, test, prod) |
| [ ] | TC-003 | Backend | 🔴 CRÍTICA | US-003 | Bloqueo de promoción ante fallos críticos en smoke tests |
| [ ] | TC-004 | Backend | 🔴 CRÍTICA | US-004 | Equivalencia funcional tras migración a Clean Architecture |
| [ ] | TC-005 | Backend | 🟠 ALTA | US-007 | Pipeline CI/CD Backend compila y despliega sin interrumpir frontend |
| [ ] | TC-006 | Backend | 🟠 ALTA | US-008 | Ejecución con usuario no privilegiado y healthcheck activo |
| [ ] | TC-007 | Backend | 🔴 CRÍTICA | US-008 | Imagen runtime sin JDK/Maven ni código fuente expuesto |
| [ ] | TC-008 | Frontend | 🔴 CRÍTICA | US-005 | Pipeline CI/CD Frontend ejecuta lint, tests y despliega condicionalmente |
| [ ] | TC-009 | Frontend | 🔴 CRÍTICA | US-006 | Imagen final sin runtime Node ni código fuente |
| [ ] | TC-010 | Frontend | 🟠 ALTA | US-006 | Nginx sirve estáticos correctamente en puerto 5173 |
| [ ] | TC-011 | Frontend | 🟠 ALTA | US-005 | Imagen Docker tageada con latest y SHA en DockerHub |
| [ ] | TC-012 | Backend | 🟠 ALTA | US-002 | Aislamiento de variables de entorno entre ambientes |

---

## 🔵 Pruebas Backend

### TC-001 — Build seguro de imágenes Docker sin vulnerabilidades críticas

- **ID del Test**: TC-001
- **Capa**: Backend
- **Prioridad**: 🔴 CRÍTICA
- **Historia asociada**: US-001
- **Descripción**: Verificar que las imágenes Docker refactorizadas pasan un escaneo de vulnerabilidades sin hallazgos de severidad crítica y cumplen con los tiempos de build esperados.
- **Riesgo cubierto**: Despliegue de imágenes con vulnerabilidades conocidas que comprometan la seguridad del sistema en producción.
- **Precondiciones**: Dockerfile refactorizados disponibles para todos los servicios (producer-api, consumer-worker, frontend). Herramienta de escaneo de vulnerabilidades configurada (Trivy, Snyk o similar).
- **Postcondiciones**: Imágenes construidas almacenadas en registro sin vulnerabilidades críticas.

#### Escenario (Gherkin)

```gherkin
Given que los Dockerfile han sido refactorizados aplicando multi-stage build y mejores prácticas de seguridad
When se ejecuta el build de cada imagen y se corre un escaneo de vulnerabilidades (e.g., Trivy)
Then no se reportan vulnerabilidades de severidad CRITICAL
  And el tiempo de build no excede el umbral definido por el equipo
  And el linter de Dockerfile (Hadolint) no reporta errores
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Imagen base válida | eclipse-temurin:17-jdk-alpine, node:20-alpine, nginx:alpine | Válido |
| Imagen base desactualizada | node:14, openjdk:8 | Inválido |
| Dockerfile con usuario root | USER root | Inválido |
| Dockerfile con usuario no privilegiado | USER appuser | Válido |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| 0 vulnerabilidades CRITICAL | Escaneo post-build | Build aprobado |
| 1 vulnerabilidad CRITICAL | Escaneo post-build | Build rechazado |
| Tiempo de build = umbral máximo | Build completo | Aprobado en límite |
| Tiempo de build > umbral máximo | Build completo | Alerta de performance |

---

### TC-002 — Despliegue reproducible por ambiente (dev, test, prod)

- **ID del Test**: TC-002
- **Capa**: Backend
- **Prioridad**: 🔴 CRÍTICA
- **Historia asociada**: US-002
- **Descripción**: Validar que los archivos docker-compose versionados para cada ambiente despliegan los servicios correctamente sin errores de configuración ni conflictos entre ambientes.
- **Riesgo cubierto**: Configuración incorrecta que cause caída de servicios o contaminación entre ambientes (e.g., base de datos de prod accedida desde dev).
- **Precondiciones**: Archivos docker-compose.dev.yml, docker-compose.test.yml y docker-compose.prod.yml disponibles y versionados.
- **Postcondiciones**: Todos los servicios definidos en el compose del ambiente objetivo están en estado running/healthy.

#### Escenario (Gherkin)

```gherkin
Given que existen archivos docker-compose versionados para dev, test y prod
When se ejecuta `docker-compose -f docker-compose.<ambiente>.yml up -d` en cada ambiente
Then todos los servicios definidos alcanzan el estado "running" o "healthy"
  And no se reportan errores de configuración en los logs de arranque
  And las variables de entorno corresponden exclusivamente al ambiente desplegado
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Ambiente válido | dev, test, prod | Válido |
| Archivo compose inexistente | docker-compose.staging.yml | Inválido |
| Variables de entorno correctas | DB_HOST=db-dev para dev | Válido |
| Variables de entorno cruzadas | DB_HOST=db-prod en dev | Inválido |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| Todos los servicios healthy | Despliegue completo | Ambiente operativo |
| 1 servicio en estado unhealthy | Despliegue parcial | Error reportado, rollback |
| 0 servicios definidos en compose | Archivo vacío | Error de validación |

#### Tabla de Decisión

| Condición | Regla 1 | Regla 2 | Regla 3 |
|-----------|---------|---------|---------|
| Archivo compose existe | Sí | Sí | No |
| Variables de entorno correctas | Sí | No | — |
| **Resultado** | Despliegue exitoso | Despliegue con errores | Fallo inmediato |

---

### TC-003 — Bloqueo de promoción ante fallos críticos en smoke tests

- **ID del Test**: TC-003
- **Capa**: Backend
- **Prioridad**: 🔴 CRÍTICA
- **Historia asociada**: US-003
- **Descripción**: Verificar que el pipeline bloquea la promoción a producción cuando las pruebas de integración o smoke tests post-despliegue detectan fallos críticos.
- **Riesgo cubierto**: Promoción de una versión inestable a producción que cause interrupción del servicio.
- **Precondiciones**: Pipeline CI/CD configurado con etapa de smoke tests post-despliegue. Ambiente de pre-producción disponible.
- **Postcondiciones**: Si hay fallos, la promoción se detiene y se genera reporte de errores. Si pasa, se habilita la siguiente etapa.

#### Escenario (Gherkin)

```gherkin
Given que se ha completado un despliegue en el ambiente de pre-producción
When se ejecutan las pruebas de integración y smoke tests automatizados
  And al menos una prueba crítica falla
Then el pipeline bloquea la promoción al siguiente ambiente
  And se genera un reporte detallado con los fallos detectados
  And se notifica al equipo responsable
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Todas las pruebas pasan | 100% success rate | Válido — promoción habilitada |
| Fallo en prueba crítica | Health endpoint retorna 500 | Inválido — promoción bloqueada |
| Fallo en prueba no crítica | Tiempo de respuesta alto pero funcional | Válido — promoción con warning |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| 0 fallos críticos | Suite de smoke tests | Promoción habilitada |
| 1 fallo crítico | Suite de smoke tests | Promoción bloqueada |
| Timeout en ejecución de tests | Suite no termina en tiempo límite | Promoción bloqueada |

---

### TC-004 — Equivalencia funcional tras migración a Clean Architecture

- **ID del Test**: TC-004
- **Capa**: Backend
- **Prioridad**: 🔴 CRÍTICA
- **Historia asociada**: US-004
- **Descripción**: Validar que tras la refactorización del producer-api a Clean Architecture, las rutas API existentes devuelven respuestas idénticas al sistema anterior y los puertos de dominio funcionan correctamente.
- **Riesgo cubierto**: Regresión funcional que rompa la publicación de Kudos o altere el comportamiento de la API pública.
- **Precondiciones**: Producer-api refactorizado a Clean Architecture con puertos `KudoEventPublisher` y `KudoValidationStrategy` implementados. Suite de pruebas de regresión disponible.
- **Postcondiciones**: Todas las rutas API mantienen contrato idéntico. Cobertura de pruebas unitarias en núcleo ≥ 90%.

#### Escenario (Gherkin)

```gherkin
Given que la lógica de publicación de Kudos reside en el núcleo limpio del producer-api
When se invoca el endpoint de publicación a través del puerto KudoEventPublisher
Then el resultado es idéntico al sistema anterior
  And las rutas API no cambian (mismos paths, métodos HTTP y códigos de respuesta)
  And el mensaje se publica correctamente en RabbitMQ
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Kudos válido | Payload con todos los campos requeridos | Válido — publicación exitosa |
| Kudos con campos faltantes | Payload sin campo obligatorio | Inválido — error de validación |
| Puerto de publicación inyectado correctamente | Adaptador RabbitMQ | Válido |
| Puerto de publicación no disponible | Adaptador RabbitMQ caído | Inválido — error controlado |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| Cobertura de núcleo = 90% | Pruebas unitarias | Umbral mínimo aceptado |
| Cobertura de núcleo < 90% | Pruebas unitarias | DoD no cumplido |
| Respuesta API idéntica al sistema legacy | Comparación de contratos | Migración exitosa |
| Respuesta API difiere del legacy | Comparación de contratos | Regresión detectada |

#### Tabla de Decisión

| Condición | Regla 1 | Regla 2 | Regla 3 |
|-----------|---------|---------|---------|
| Rutas API sin cambios | Sí | No | Sí |
| Respuestas idénticas | Sí | — | No |
| Cobertura ≥ 90% | Sí | — | — |
| **Resultado** | Migración aprobada | Regresión de contrato | Regresión de datos |

---

### TC-005 — Pipeline CI/CD Backend compila y despliega sin interrumpir frontend

- **ID del Test**: TC-005
- **Capa**: Backend
- **Prioridad**: 🟠 ALTA
- **Historia asociada**: US-007
- **Descripción**: Verificar que el pipeline de backend se activa solo ante cambios en producer-api o consumer-worker, compila con Maven/Testcontainers, y despliega en EC2 sin afectar el contenedor frontend.
- **Riesgo cubierto**: Despliegue de backend que derriba el frontend, causando indisponibilidad total del sistema.
- **Precondiciones**: Pipeline CI/CD de backend configurado en GitHub Actions. Servidor EC2 con docker-compose en ejecución. Contenedor frontend activo.
- **Postcondiciones**: Contenedores de backend actualizados. Contenedor frontend sin reinicio ni interrupción.

#### Escenario (Gherkin)

```gherkin
Given un cambio en el código fuente de producer-api o consumer-worker (excluyendo markdown)
When se ejecuta un push a main desencadenando el pipeline de backend
Then las pruebas con Jacoco/Surefire y Testcontainers pasan exitosamente
  And las imágenes Docker se compilan vía Buildx y se suben a DockerHub
  And solo los contenedores de backend se recrean en EC2 usando --no-deps
  And el contenedor frontend permanece en ejecución sin interrupciones
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Cambio en código Java backend | Cambio en producer-api/src/ | Válido — pipeline se activa |
| Cambio solo en frontend | Cambio en frontend/src/ | Inválido — pipeline NO se activa |
| Cambio solo en documentación | Cambio en *.md | Inválido — pipeline NO se activa |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| 0 tests fallidos en Maven | Fase de pruebas | Continúa a build Docker |
| 1 test fallido en Maven | Fase de pruebas | Pipeline se detiene, no hay deploy |
| Frontend container uptime durante deploy | Monitoreo | Sin interrupción (uptime continuo) |

---

### TC-006 — Ejecución con usuario no privilegiado y healthcheck activo

- **ID del Test**: TC-006
- **Capa**: Backend
- **Prioridad**: 🟠 ALTA
- **Historia asociada**: US-008
- **Descripción**: Validar que los contenedores de producer-api y consumer-worker ejecutan el proceso Java con el usuario `appuser` (UID 1000) y que el HEALTHCHECK interno reporta correctamente el estado del servicio.
- **Riesgo cubierto**: Ejecución como root que permita escalación de privilegios en caso de vulnerabilidad; healthcheck inactivo que impida detectar caídas.
- **Precondiciones**: Imágenes Docker de producer-api y consumer-worker construidas con el Dockerfile multi-stage. Contenedores en ejecución.
- **Postcondiciones**: Proceso ejecutándose como appuser. Healthcheck reportando estado healthy.

#### Escenario (Gherkin)

```gherkin
Given que los contenedores de backend se han construido con el Dockerfile multi-stage securizado
When se inspeccionan los procesos en ejecución dentro del contenedor
Then el proceso Java se ejecuta bajo el usuario "appuser" (UID 1000) y NO como root
  And el HEALTHCHECK configurado con wget reporta estado "healthy" al endpoint correspondiente
  And no existen binarios de JDK ni Maven en la imagen runtime
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Usuario de ejecución | appuser (UID 1000) | Válido |
| Usuario de ejecución | root (UID 0) | Inválido — riesgo de seguridad |
| Healthcheck response | HTTP 200 | Válido — healthy |
| Healthcheck response | HTTP 500 o timeout | Inválido — unhealthy |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| UID = 1000 | Inspección de proceso | Usuario no privilegiado confirmado |
| UID = 0 | Inspección de proceso | Fallo de seguridad |
| Healthcheck interval cumplido | Docker inspect | Estado healthy |
| Healthcheck 3 retries fallidos | Docker inspect | Estado unhealthy, alerta |

---

### TC-007 — Imagen runtime sin JDK/Maven ni código fuente expuesto

- **ID del Test**: TC-007
- **Capa**: Backend
- **Prioridad**: 🔴 CRÍTICA
- **Historia asociada**: US-008
- **Descripción**: Verificar que la imagen final de runtime de los microservicios Java solo contiene el JRE Alpine, el JAR compilado y la configuración mínima necesaria, sin exponer herramientas de desarrollo ni código fuente.
- **Riesgo cubierto**: Exposición de código fuente o herramientas de compilación en producción que amplíen la superficie de ataque.
- **Precondiciones**: Imágenes Docker construidas con el patrón multi-stage definido en US-008.
- **Postcondiciones**: Imagen final contiene exclusivamente JRE, JAR y configuración runtime.

#### Escenario (Gherkin)

```gherkin
Given que las imágenes de producer-api y consumer-worker fueron construidas con multi-stage build
When se inspecciona el sistema de archivos de la imagen final de runtime
Then NO existen binarios de javac, mvn ni Maven Wrapper
  And NO existe el directorio de código fuente /app/src
  And la imagen base es eclipse-temurin:17-jre-alpine
  And solo existe el archivo JAR compilado en el directorio de trabajo
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Contenido en imagen final | app.jar, JRE binaries | Válido |
| Contenido en imagen final | javac, mvnw, src/ | Inválido — leak de build |
| Imagen base runtime | eclipse-temurin:17-jre-alpine | Válido |
| Imagen base runtime | eclipse-temurin:17-jdk-alpine | Inválido — exceso de superficie |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| 0 archivos .java en imagen final | Inspección de filesystem | Seguro |
| ≥1 archivo .java en imagen final | Inspección de filesystem | Fallo de seguridad |
| Tamaño de imagen < imagen JDK equivalente | Comparación de tamaño | Multi-stage efectivo |

---

### TC-012 — Aislamiento de variables de entorno entre ambientes

- **ID del Test**: TC-012
- **Capa**: Backend
- **Prioridad**: 🟠 ALTA
- **Historia asociada**: US-002
- **Descripción**: Verificar que las variables de entorno (conexiones a BD, URLs de servicio, secrets) de cada archivo docker-compose no se filtran ni contaminan entre ambientes.
- **Riesgo cubierto**: Contaminación de datos críticos entre ambientes que cause pérdida de datos o acceso indebido a producción desde desarrollo.
- **Precondiciones**: Archivos docker-compose por ambiente con variables de entorno diferenciadas.
- **Postcondiciones**: Cada contenedor opera exclusivamente con las variables de su ambiente.

#### Escenario (Gherkin)

```gherkin
Given que los archivos docker-compose definen variables de entorno específicas por ambiente
When se despliega el ambiente de dev
Then las variables de conexión a base de datos apuntan exclusivamente al host de dev
  And no existen referencias a hosts de prod o test en las variables del contenedor
  And los secrets inyectados corresponden al ambiente correcto
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Variables dev en ambiente dev | DB_HOST=db-dev, RABBITMQ_HOST=rabbit-dev | Válido |
| Variables prod en ambiente dev | DB_HOST=db-prod | Inválido — contaminación |
| Secrets del ambiente correct | API_KEY=dev-key-xxx | Válido |
| Secrets de otro ambiente | API_KEY=prod-key-xxx en dev | Inválido — riesgo de seguridad |

#### Tabla de Decisión

| Condición | Regla 1 | Regla 2 | Regla 3 |
|-----------|---------|---------|---------|
| Variables corresponden al ambiente | Sí | No | No |
| Secrets corresponden al ambiente | Sí | Sí | No |
| **Resultado** | Despliegue seguro | Contaminación de config | Riesgo crítico de seguridad |

---

## 🟢 Pruebas Frontend

### TC-008 — Pipeline CI/CD Frontend ejecuta lint, tests y despliega condicionalmente

- **ID del Test**: TC-008
- **Capa**: Frontend
- **Prioridad**: 🔴 CRÍTICA
- **Historia asociada**: US-005
- **Descripción**: Verificar que el pipeline del frontend se activa exclusivamente ante cambios en el directorio frontend/ (excluyendo documentación), ejecuta lint y unit tests, y despliega solo si todas las etapas pasan.
- **Riesgo cubierto**: Despliegue de código frontend con errores de lint o tests fallidos que comprometa la experiencia del usuario en producción.
- **Precondiciones**: Pipeline CI/CD de frontend configurado en GitHub Actions con path filtering. Ambiente EC2 con docker-compose activo.
- **Postcondiciones**: Contenedor frontend actualizado con código validado. Coverage reportado.

#### Escenario (Gherkin)

```gherkin
Given un push a la rama main con cambios en el directorio frontend/ (omitiendo documentación)
When el workflow ejecuta exitosamente npm ci, ESLint y Vitest unit tests
Then se construye y sube la imagen Docker con caché type=gha
  And se actualiza el contenedor frontend vía SSH sobre EC2
  And el reporte de coverage de Vitest se genera y almacena como artifact
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Cambio en código frontend | frontend/src/*.tsx modificado | Válido — pipeline se activa |
| Cambio en docs frontend | frontend/README.md | Inválido — pipeline NO se activa |
| Cambio en backend | producer-api/src/ | Inválido — pipeline NO se activa |
| Lint sin errores | ESLint exit code 0 | Válido — continúa pipeline |
| Lint con errores | ESLint exit code 1 | Inválido — pipeline se detiene |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| 0 errores de ESLint | Fase de lint | Continúa a tests |
| 1 error de ESLint | Fase de lint | Pipeline bloqueado |
| 100% tests passing | Fase de Vitest | Continúa a build Docker |
| 1 test fallido | Fase de Vitest | Pipeline bloqueado, no hay deploy |

#### Tabla de Decisión

| Condición | Regla 1 | Regla 2 | Regla 3 | Regla 4 |
|-----------|---------|---------|---------|---------|
| Cambio en frontend/ | Sí | Sí | Sí | No |
| ESLint pasa | Sí | No | Sí | — |
| Vitest pasa | Sí | — | No | — |
| **Resultado** | Deploy exitoso | Bloqueado en lint | Bloqueado en tests | Pipeline no se activa |

---

### TC-009 — Imagen final sin runtime Node ni código fuente

- **ID del Test**: TC-009
- **Capa**: Frontend
- **Prioridad**: 🔴 CRÍTICA
- **Historia asociada**: US-006
- **Descripción**: Verificar que la imagen Docker final del frontend solo contiene los archivos estáticos compilados (dist/) y la configuración de Nginx, sin el runtime de Node.js ni el código fuente React.
- **Riesgo cubierto**: Exposición de código fuente o runtime innecesario en producción que amplíe la superficie de ataque y el tamaño de la imagen.
- **Precondiciones**: Dockerfile multi-stage del frontend disponible con etapa builder (Node Alpine) y etapa final (Nginx Alpine).
- **Postcondiciones**: Imagen final contiene exclusivamente nginx, archivos estáticos y configuración.

#### Escenario (Gherkin)

```gherkin
Given el código fuente React sin compilar en el directorio frontend/
When se ejecuta docker build utilizando el Dockerfile multi-stage
Then la etapa builder transfiere solo la carpeta dist/ al entorno nginx:alpine
  And NO existe el binario de node ni npm en la imagen final
  And NO existen archivos .tsx, .ts, .jsx, .js fuente en la imagen final
  And la imagen final contiene únicamente nginx.conf y los assets estáticos
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Contenido en imagen final | dist/, nginx.conf | Válido |
| Contenido en imagen final | node_modules/, src/, package.json | Inválido — leak de build |
| Imagen base final | nginx:alpine | Válido |
| Imagen base final | node:20-alpine | Inválido — runtime innecesario |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| 0 archivos .tsx en imagen final | Inspección de filesystem | Seguro |
| ≥1 archivo .tsx en imagen final | Inspección de filesystem | Fallo de seguridad |
| Tamaño imagen final < 50MB | Comparación | Multi-stage efectivo |
| Tamaño imagen final > 500MB | Comparación | Node runtime presente, fallo |

---

### TC-010 — Nginx sirve estáticos correctamente en puerto 5173

- **ID del Test**: TC-010
- **Capa**: Frontend
- **Prioridad**: 🟠 ALTA
- **Historia asociada**: US-006
- **Descripción**: Validar que el contenedor frontend construido con multi-stage build sirve correctamente la aplicación React a través de Nginx en el puerto 5173 con modo daemon off.
- **Riesgo cubierto**: Contenedor frontend no accesible o Nginx mal configurado que impida el acceso a la aplicación.
- **Precondiciones**: Imagen Docker del frontend construida exitosamente. Contenedor iniciado con puerto 5173 expuesto.
- **Postcondiciones**: Aplicación React accesible vía HTTP en puerto 5173.

#### Escenario (Gherkin)

```gherkin
Given que la imagen Docker del frontend ha sido construida con multi-stage build
When se instancia el contenedor exponiendo el puerto 5173
Then una petición HTTP GET a http://localhost:5173/ retorna status 200
  And el contenido HTML corresponde al index.html de la aplicación React
  And Nginx está ejecutándose con daemon off como proceso principal del contenedor
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Ruta raíz | GET / | Válido — 200 con index.html |
| Ruta de asset estático | GET /assets/main.js | Válido — 200 con archivo |
| Ruta SPA (client-side routing) | GET /kudos | Válido — 200 con index.html (fallback) |
| Ruta inexistente sin fallback | GET /api/unknown | Depende de configuración nginx |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| Puerto 5173 accesible | Petición HTTP | Status 200 |
| Puerto 5173 no mapeado | Contenedor sin -p 5173 | Connection refused |
| nginx.conf ausente | Imagen mal construida | Contenedor no arranca |

---

### TC-011 — Imagen Docker tageada con latest y SHA en DockerHub

- **ID del Test**: TC-011
- **Capa**: Frontend
- **Prioridad**: 🟠 ALTA
- **Historia asociada**: US-005
- **Descripción**: Verificar que la imagen Docker del frontend se publica en DockerHub con doble tag: `latest` y el SHA del commit, permitiendo trazabilidad y rollback.
- **Riesgo cubierto**: Imposibilidad de hacer rollback a una versión específica o despliegue de una imagen sin trazabilidad hacia el código fuente.
- **Precondiciones**: Pipeline CI/CD ejecutado exitosamente hasta la fase de build/push Docker.
- **Postcondiciones**: Imagen disponible en DockerHub con ambos tags.

#### Escenario (Gherkin)

```gherkin
Given que el pipeline CI/CD del frontend ha pasado las fases de lint y testing
When se ejecuta la fase de build y push de la imagen Docker via Buildx
Then la imagen se publica en DockerHub con el tag "latest"
  And la imagen se publica con un tag correspondiente al SHA del commit de Git
  And ambos tags son resolvables y apuntan al mismo manifest digest
```

#### Partición de Equivalencia

| Grupo | Valores | Tipo |
|-------|---------|------|
| Tag latest | repo/frontend:latest | Válido — siempre presente |
| Tag SHA | repo/frontend:abc1234 | Válido — trazabilidad |
| Tag ausente | Sin tag SHA | Inválido — sin trazabilidad |
| Tag con formato incorrecto | repo/frontend:vX.Y.Z (no solicitado) | Fuera de alcance |

#### Valores Límite

| Valor | Contexto | Resultado Esperado |
|-------|----------|--------------------|
| 2 tags por imagen (latest + SHA) | DockerHub | Publicación correcta |
| 1 solo tag (falta SHA) | DockerHub | Trazabilidad comprometida |
| SHA de 7 caracteres | Tag corto | Válido si es único |
| SHA completo de 40 caracteres | Tag largo | Válido |
