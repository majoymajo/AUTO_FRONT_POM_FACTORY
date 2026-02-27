# TEST_PLAN_V3 — Plan de Pruebas Consolidado

**Proyecto:** Sofkianos MVP  
**Versión del Plan:** 3.0 (UB3)  
**Fecha de Creación:** 26 de febrero de 2026  
**Última Actualización:** 26 de febrero de 2026  

---

## 1. Objetivo y Descripción

### 1.1 Objetivo

Establecer un plan de pruebas integral, consolidado y evolutivo que garantice la calidad del sistema **Sofkianos MVP** en sus dimensiones funcional, de integración, de infraestructura y de despliegue. Este plan unifica los ciclos de prueba previos (listado público de Kudos y despliegue/infraestructura) con las mejoras derivadas de la refactorización a Clean Architecture y la incorporación de pruebas de integración para los endpoints REST.

### 1.2 Descripción

Sofkianos MVP es un sistema distribuido basado en microservicios que permite a los usuarios enviar y consultar reconocimientos (Kudos) entre compañeros. La arquitectura comprende:

- **Producer API** (Spring Boot): Recibe solicitudes REST, valida entradas, publica eventos a RabbitMQ y expone el endpoint de listado público de Kudos con paginación, filtros.
- **Consumer Worker** (Spring Boot): Consume eventos de RabbitMQ, aplica lógica de dominio (Builder pattern con validaciones) y persiste en PostgreSQL.
- **Frontend** (React + Vite + Nginx): Aplicación SPA servida como estáticos en contenedor Nginx Alpine.
- **Infraestructura**: Docker multi-stage builds, docker-compose por ambiente (dev, test, prod), pipelines CI/CD en GitHub Actions, despliegue en AWS EC2.

El sistema ha sido refactorizado aplicando **Clean Architecture(Hexagonal Architecture Pattern)** (Builder, Adapter/Ports, Strategy) para desacoplar el dominio de la infraestructura, lo cual introduce nuevos vectores de riesgo validados en este plan.

---

## 2. Alcance de las Pruebas

### 2.1 En Alcance

#### Historias de Usuario Cubiertas

| ID | Historia de Usuario | Área |
|:---|:---|:---|
| US-001 | Refactorización y estandarización de Dockerfile (seguridad y eficiencia) | Infraestructura |
| US-002 | Versionado de docker-compose por ambiente (dev, test, prod) | Infraestructura |
| US-003 | Automatización de pruebas de integración y smoke tests post-despliegue | QA / Pipeline |
| US-004 | Refactorización a Clean Architecture: producer-api | Backend |
| US-005 | Pipeline CI/CD del Frontend | CI/CD |
| US-006 | Dockerización Multi-Stage del Frontend | Infraestructura |
| US-007 | Pipeline CI/CD del Backend (API & Worker) | CI/CD |
| US-008 | Dockerización Segura Multi-Stage de Microservicios Backend | Infraestructura |
| US-012 | Integración Frontend–Backend para listado de Kudos | Integración |

#### Endpoints REST Bajo Prueba

| Método | Ruta | Descripción |
|:---|:---|:---|
| GET | `/api/v1/kudos` | Listado público paginado con filtros |

#### Casos de Prueba Derivados

Se consolidan **12 casos de prueba** distribuidos en dos bloques funcionales:

- **Bloque A — Listado Público de Kudos (TC-A-008 a TC-A-011):** Validación de paginación, filtros, enmascaramiento, manejo de errores y renderizado frontend.
- **Bloque B — Despliegue e Infraestructura (TCB-001; TC-B-007 a TC-B-012):** Seguridad de imágenes Docker, despliegue por ambiente, pipelines CI/CD, multi-stage builds y aislamiento de variables.

### 2.2 Fuera de Alcance

- Pruebas de autenticación/autorización (no implementadas en MVP).
- Pruebas de rendimiento bajo carga (load testing, stress testing).
- Pruebas de seguridad avanzadas (penetration testing, OWASP ZAP scan).
- Pruebas de accesibilidad (WCAG compliance).
- Validación de flujos de notificación por email o webhooks.
- Pruebas del Consumer Worker como API REST (solo consume mensajes de RabbitMQ).
- Pruebas de despliegue en ambientes distintos a dev, test y prod.

---

## 3. Estrategia y Enfoque de Pruebas

### 3.1 Estrategia de Ejecución

La estrategia sigue el principio ISTQB: **"Las pruebas dependen del contexto"**. En un sistema distribuido con mensajería asíncrona (RabbitMQ) y arquitectura hexagonal, la calidad no se limita a la lógica funcional sino a la **integridad de los datos** en todo su ciclo de vida.

Se aplica la **Pirámide de Pruebas** con la siguiente distribución:

| Nivel | Proporción | Enfoque | Herramientas |
|:---|:---:|:---|:---|
| Unitario | 70% | Dominio (Builder, validaciones, Strategy) | JUnit 5, Mockito, Vitest |
| Integración | 20% | Adapters, contratos de serialización, endpoints REST | Testcontainers, Spring Boot Test, MSW |
|

### 3.2 Niveles y Tipos de Prueba

#### Pruebas Unitarias
- Validación del `Kudo.Builder` con reglas de negocio (auto-kudo, campos vacíos).
- `KudoCategory` enum y conversiones `fromString()`.
- `KudoValidationStrategy` por categoría (Strategy pattern).
- Componentes React aislados (KudosListPage, KudoFilters, KudoPagination).

#### Pruebas de Integración
- Serialización de `KudoEvent` con fechas ISO-8601 (prevención del incidente "Kudo Fantasma").
- `RabbitMqKudoPublisher` contra contenedor RabbitMQ (Testcontainers).
- Endpoint `GET /api/v1/kudos`: paginación, filtros, manejo de errores.
- Endpoint `POST /api/v1/kudos`: validación de entrada, publicación, respuestas de error.

#### Pruebas Funcionales
- Pipelines CI/CD (Backend y Frontend) ejecutan correctamente lint, tests y deploy condicional.
- Imágenes Docker multi-stage cumplen estándares de seguridad (sin JDK/Maven/Node en runtime).
- docker-compose por ambiente despliega sin errores de configuración.
- Frontend Nginx sirve estáticos correctamente en puerto 5173.

### 3.3 Criterios de Entrada y Salida

#### Criterios de Entrada

| Criterio | Descripción |
|:---|:---|
| Código fuente | Rama `Develop` con último merge aprobado |
| Ambiente | Ambiente de prueba desplegado y accesible |
| Datos de prueba | Base de datos seed con mínimo 50 Kudos |
| Dependencias | RabbitMQ, PostgreSQL y Nginx corriendo |
| Pipeline | Pipeline CI/CD ejecutando sin errores de configuración |
| Documentación | Historias de usuario y criterios de aceptación disponibles |

#### Criterios de Salida

| Criterio | Umbral |
|:---|:---|
| Casos de prueba ejecutados | 100% de los TC en alcance |
| Tasa de aprobación | ≥ 95% de TC aprobados |
| Defectos críticos abiertos | 0 defectos de severidad CRÍTICA |
| Defectos altos abiertos | ≤ 2 defectos de severidad ALTA |
| Cobertura de código (backend core) | ≥ 90% |
| Cobertura de código (frontend) | ≥ 80% |
| Smoke tests post-despliegue | 100% aprobados |

### 3.4 Estrategia de Datos de Prueba

| Tipo de Dato | Estrategia |
|:---|:---|
| Kudos de prueba | Seed SQL con 50+ registros distribuidos en 4 categorías (Innovation, Teamwork, Passion, Mastery) y fechas variadas |
| Categorías inválidas | Strings como `"INVALID"`, `"SUPER_KUDO"` para validar rechazos |
| Payloads malformados | JSON incompleto, campos nulos, auto-kudos para pruebas negativas |
| Variables de entorno | Conjuntos diferenciados por ambiente (dev, test, prod) |

---

## 4. Requerimientos / Prerrequisitos

### 4.1 Ambientes de Prueba

| Ambiente | Propósito | Infraestructura |
|:---|:---|:---|
| Local (dev) | Desarrollo y pruebas unitarias | Docker Desktop, docker-compose.dev.yml |
| Test | Pruebas de integración y funcionales | docker-compose.test.yml |
| Pre-producción (staging) | Smoke tests y validación final | docker-compose.prod.yml |

### 4.2 Accesos Técnicos

- Repositorio GitHub con permisos de lectura/escritura en rama `develop`.
- DockerHub para publicación y descarga de imágenes.
- Base de datos PostgreSQL con credenciales por ambiente.
- RabbitMQ Management Console (puerto 15672) para inspección de colas y DLQ.

### 4.3 Herramientas de Testing y Gestión de Defectos

| Herramienta | Uso |
|:---|:---|
| **JUnit 5 + Mockito** | Tests unitarios backend |
| **Testcontainers** | Tests de integración (RabbitMQ, PostgreSQL) |
| **Jacoco + Surefire** | Cobertura y reportes de pruebas backend |
| **Vitest + React Testing Library** | Tests unitarios y de componentes frontend |
| **MSW (Mock Service Worker)** | Mocks de API para tests frontend |
| **ESLint** | Análisis estático de código frontend |
| **Hadolint** | Linting de Dockerfile |
| **Trivy / Snyk** | Escaneo de vulnerabilidades en imágenes Docker |
| **GitHub Actions** | Pipeline CI/CD y ejecución automatizada de tests |
| **GitHub Issues** | Gestión de defectos y seguimiento |

### 4.4 Datos de Prueba Necesarios

- Script SQL seed (`seed-test-data.sql`) con 50+ Kudos.
- Archivos `.env` por ambiente con variables diferenciadas.
- Secrets de GitHub Actions configurados (DOCKER_USER, DOCKER_TOKEN, etc.).

---

## 5. Gestión de Riesgos

### 5.1 Matriz de Riesgos del Producto

| ID | Elemento (HU / Endpoint) | Riesgo Identificado | Prob. (1–3) | Impacto (1–3) | Nivel (PxI) | Estrategia de Mitigación |
|:---|:---|:---|:---:|:---:|:---:|:---|
| RP-01 | US-004 / POST `/api/v1/kudos` | Regresión funcional tras migración a Clean Architecture que rompa la publicación de Kudos | 2 | 3 | **6** | Tests de regresión comparando respuestas pre/post refactorización. Cobertura de núcleo ≥ 90%. |
| RP-02 | Adapter RabbitMQ | Fallo de serialización de fechas (incidente "Kudo Fantasma"): `LocalDateTime` serializado como array en lugar de ISO-8601 | 2 | 3 | **6** | Test de integración con Testcontainers validando contrato JSON. Configuración explícita de `JavaTimeModule`. |
| RP-03 | US-001 / Dockerfile | Imágenes Docker con vulnerabilidades críticas desplegadas en producción | 1 | 3 | **3** | Escaneo con Trivy/Snyk en pipeline. Build rechazado si ≥1 vulnerabilidad CRITICAL. |
| RP-04 | US-002 / docker-compose | Contaminación de variables de entorno entre ambientes (e.g., BD de prod accedida desde dev) | 1 | 3 | **3** | Validación de variables por contenedor post-despliegue. Tabla de decisión en TC-B-012. |
| RP-05 | US-003 / Pipeline | Promoción de versión inestable a producción por falta de smoke tests | 2 | 3 | **6** | Pipeline bloquea promoción si ≥1 prueba crítica falla. Notificación automática al equipo. |
| RP-06 | GET `/api/v1/kudos` | Queries masivas por parámetro `size` sin límite que generen problemas de memoria | 2 | 2 | **4** | Validación `@Min(1) @Max(50)` en size. Test de valores límite (0, 51). |
| RP-07 | US-008 / Contenedores | Ejecución de procesos como root que permita escalación de privilegios | 1 | 3 | **3** | Inspección de UID del proceso en contenedor. Dockerfile con usuario `appuser` (UID 1000). |
| RP-08 | Consumer / DLQ | Mensajes "venenosos" (categoría inválida) generan bucle infinito de reintentos | 2 | 2 | **4** | Configuración de DLQ con `x-dead-letter-exchange`. Test de caos con mensaje inválido. |
| RP-09 | GET `/api/v1/kudos` | Filtros dinámicos generan queries SQL incorrectas o ignoran criterios | 2 | 2 | **4** | Tests de integración con `KudoSpecifications` validando queries generadas por combinación de filtros. |
| RP-10 | US-007 / Pipeline Backend | Despliegue de backend derriba contenedor frontend, causando indisponibilidad total | 1 | 3 | **3** | Deploy con `--no-deps` que recrea solo servicios backend. Monitoreo de uptime del frontend. |
| RP-11 | Frontend / UX | Usuario ve pantalla en blanco sin feedback (sin loading, error o empty state) | 2 | 2 | **4** | Tests de componente validando renderizado de SkeletonLoaders, ErrorMessage y EmptyState. |

### 5.2 Matriz de Riesgos del Proyecto

| ID | Riesgo del Proyecto | Prob. (1–3) | Impacto (1–3) | Nivel (PxI) | Estrategia de Mitigación |
|:---|:---|:---:|:---:|:---:|:---|
| RPY-01 | Ambientes de prueba no disponibles por falta de recursos cloud | 2 | 3 | **6** | Priorizar pruebas en ambiente local con docker-compose. Escalamiento temprano a DevOps. |
| RPY-02 | Datos de prueba insuficientes o inconsistentes entre ambientes | 2 | 2 | **4** | Script de seed automatizado ejecutado en pipeline antes de las pruebas. |
| RPY-03 | Retraso en la refactorización a Clean Architecture que bloquee pruebas de integración | 2 | 2 | **4** | Pruebas de integración diseñadas contra interfaces (ports), ejecutables con mocks si adapters no están listos. |
| RPY-04 | Falta de experiencia del equipo con Testcontainers y pruebas de infraestructura | 2 | 2 | **4** | Sesiones de pair programming y documentación de ejemplos prácticos. |
| RPY-05 | Cambios frecuentes en los endpoints que invaliden casos de prueba | 1 | 2 | **2** | Contratos API versionados. Tests basados en JSON Schema. Notificación obligatoria al QA ante cambios de contrato. |

---

## 6. Equipo de Trabajo e Implicados

### 6.1 Roles y Responsabilidades

| Rol | Responsabilidad |
|:---|:---|
| **QA Lead** | Diseño y mantenimiento del plan de pruebas. Definición de estrategia de calidad. Gestión de riesgos. Revisión de métricas de cobertura y resultados. Coordinación con Product Owner y Scrum Master. |
| **QA Manual** | Ejecución de pruebas exploratorias. Validación de UX/UI (estados loading, error, empty). Verificación de smoke tests post-despliegue. Documentación de defectos. |
| **QA Automation** | Desarrollo y mantenimiento de suites automatizadas (JUnit, Vitest, Playwright). Configuración de Testcontainers. Integración de reportes de cobertura en pipeline CI/CD. |
| **Developer** | Implementación de pruebas unitarias y de integración como parte del DoD. Corrección de defectos reportados. Soporte técnico para configuración de ambientes de prueba. |
| **Product Owner** | Validación de criterios de aceptación. Priorización de defectos según impacto en el negocio. Aprobación de la entrega al usuario final. |
| **Scrum Master** | Facilitación de la comunicación entre QA y desarrollo. Seguimiento del cronograma de pruebas dentro del sprint. Eliminación de impedimentos para la ejecución de pruebas. |

---

## 7. Cronograma y Acuerdos

### 7.1 Calendario de Ejecución de Pruebas

| Fase | Actividades | Duración Estimada | Responsable |
|:---|:---|:---:|:---|
| **Diseño** | Revisión de HU, diseño de TC, preparación de datos | 2 días | QA Lead, QA Manual |
| **Unitarias** | Ejecución de pruebas unitarias (backend + frontend) | Continuo (en cada PR) | Developers, QA Automation |
| **Integración** | Pruebas de integración de endpoints REST y adapters | 3 días | QA Automation, Developers |
| **Funcionales** | Validación de pipelines, Docker builds, despliegue por ambiente | 2 días | QA Manual, QA Automation
| **Smoke Tests** | Validación post-despliegue en staging | 1 día (por despliegue) | QA Manual |
| **Reporte** | Consolidación de resultados, métricas y defectos | 1 día | QA Lead |

### 7.2 Hitos

| Hito | Fecha Objetivo | Criterio de Cumplimiento |
|:---|:---|:---|
| Plan de Pruebas aprobado (TEST_PLAN_UB3) | 26 de febrero de 2026 | Documento revisado y aprobado por QA Lead y PO |
| Suite unitaria estable al 90% de cobertura (core) | 28 de febrero de 2026 | Jacoco report ≥ 90% en paquetes de dominio |
| Pruebas de integración de endpoints completadas | 2 de marzo de 2026 | 100% de TC de integración ejecutados, ≥ 95% aprobados |
| Pruebas de infraestructura y pipelines completadas | 4 de marzo de 2026 | Todos los TC de deploy ejecutados sin defectos críticos |
| Smoke tests en staging aprobados | 5 de marzo de 2026 | Health checks, endpoints críticos y servicios running/healthy |
| Cierre del ciclo de pruebas | 6 de marzo de 2026 | Reporte final entregado. 0 defectos críticos abiertos. |

### 7.3 Protocolos de Comunicación

| Canal | Propósito | Frecuencia |
|:---|:---|:---|
| Daily Stand-up | Reporte de avance de pruebas, bloqueos y defectos nuevos | Diaria |
| Google Sheets | Comunicación inmediata de defectos críticos o bloqueos de ambiente | Según necesidad |
| GitHub Issues | Registro formal de defectos con severidad, pasos de reproducción y evidencia | Según hallazgo |
| Sprint Review | Demostración de resultados de pruebas y métricas de calidad | Al cierre del sprint |
| Reporte de Pruebas (GitHub Actions) | Consolidación de métricas: TC ejecutados, aprobados, fallidos, cobertura | Al cierre del ciclo |

### 7.4 Acuerdos de Calidad

1. **Definition of Done (DoD):** Ninguna historia de usuario se considera "Done" sin que sus casos de prueba asociados estén ejecutados y aprobados.
2. **Zero Critical Defects:** No se autoriza el despliegue a producción con defectos de severidad CRÍTICA abiertos.
3. **Cobertura Mínima:** El código de dominio (core) debe mantener una cobertura ≥ 90%. El frontend debe mantener ≥ 80%.
4. **Regresión Obligatoria:** Toda corrección de defecto debe incluir un test de regresión que prevenga su recurrencia.
5. **Pipeline como Quality Gate:** Los pipelines CI/CD de GitHub Actions actúan como compuerta de calidad. Todo merge a `develop` debe pasar lint, tests unitarios, tests de integración y build Docker sin errores.
6. **Inspección de Imágenes:** Toda imagen Docker candidata a producción debe pasar escaneo de vulnerabilidades sin hallazgos de severidad CRITICAL.
7. **Trazabilidad:** Cada caso de prueba debe estar vinculado a una historia de usuario. Cada defecto debe referenciar el TC que lo detectó.

---
## Anexo A — Casos de Prueba

> _Nota: Markdown no soporta la incrustación directa de iframes por motivos de seguridad. Haz clic en el siguiente botón para acceder al documento._

[![Google Sheets - Tracking del Proyecto](https://img.shields.io/badge/Google%20Sheets-Tracking%20del%20Proyecto-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)](https://docs.google.com/spreadsheets/d/1B9BNs2P8Uc9wHLLaO9lWZXL5TQA7hflkfwGPXLah0is/edit?gid=0#gid=0)

---
## Anexo B — Pruebas de Integración para Endpoints REST

### INT-001 — Contrato de Serialización de KudoEvent (Prevención "Kudo Fantasma")

- **Endpoint asociado:** POST `/api/v1/kudos`
- **Nivel:** Integración (Testcontainers + RabbitMQ)
- **Riesgo cubierto:** RP-02 — Fallo de serialización de fechas
- **Validación:** El campo `timestamp` en el JSON publicado al broker es un string ISO-8601, no un array de enteros.

```gherkin
Given un KudoEvent con timestamp LocalDateTime.of(2026, 2, 11, 12, 0)
When el RabbitMqKudoPublisher serializa y publica el evento
Then el mensaje JSON en la cola contiene "timestamp":"2026-02-11T12:00:00"
  And el campo NO está representado como array [2026, 2, 11, 12, 0]
```

### INT-002 — Endpoint GET /api/v1/kudos con Filtros Combinados

- **Endpoint asociado:** GET `/api/v1/kudos`
- **Nivel:** Integración (Spring Boot Test + PostgreSQL Testcontainer)
- **Riesgo cubierto:** RP-10 — Queries incorrectas por filtros dinámicos

```gherkin
Given la base de datos contiene 45 kudos en 4 categorías con fechas variadas
When ejecuto GET /api/v1/kudos?category=TEAMWORK&startDate=2026-02-01&endDate=2026-02-10&searchText=proyecto
Then el status code es 200 OK
  And todos los items retornados cumplen los tres criterios simultáneamente
  And el query SQL aplica AND lógico entre los filtros
```
---

*Fin del documento TEST_PLAN_UB3*
