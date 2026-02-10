# Investigación de Patrones de Diseño (Fase 2)

**Fecha:** 10 de Febrero de 2026  
**Proyecto:** Sofkianos MVP  
**Arquitecto:** Antigravity (Senior Software Architect)

---

## 1. Introducción y Alcance

Esta investigación tiene como objetivo analizar el catálogo de patrones de diseño **Gang of Four (GoF)** para seleccionar las soluciones más adecuadas a los problemas arquitectónicos detectados en la auditoría técnica (**Fase 1**).

El alcance de este análisis se centra en resolver:

- Violaciones de **SRP** y **DIP** en los servicios de dominio  
- Acoplamiento fuerte a la infraestructura (RabbitMQ, Jackson)  
- Modelo de dominio anémico  

---

## 2. Análisis Categorizado de Patrones GoF

### 2.1 Patrones Creacionales

Estos patrones abstraen el proceso de instanciación y ayudan a que el sistema sea independiente de cómo se crean sus objetos.

#### Singleton
- **Intención:** Garantizar una única instancia de una clase.
- **Relevancia:** Spring Boot gestiona sus beans como *Singletons* por defecto. Implementarlo manualmente podría introducir estado global no deseado.
- **Decisión:** ❌ Descartado.

#### Factory Method
- **Intención:** Definir una interfaz para crear un objeto, delegando la decisión de instanciación.
- **Relevancia:** Útil si existieran múltiples tipos de eventos (`KudoEvent`, `AlertEvent`). Actualmente solo existe `Kudo`.
- **Decisión:** ⚠️ Baja prioridad.

#### Abstract Factory
- **Intención:** Crear familias de objetos relacionados.
- **Relevancia:** Excesivo para el dominio actual. No existen familias de productos que varíen juntas.
- **Decisión:** ❌ Descartado.

#### Builder
- **Intención:** Separar la construcción de un objeto complejo de su representación.
- **Relevancia:** ✅ Alta. Permite crear objetos de dominio (`Kudo`) válidos paso a paso, evitando constructores telescópicos y asegurando consistencia mediante validaciones en `build()`.
- **Decisión:** ✅ Recomendado.

#### Prototype
- **Intención:** Crear nuevos objetos clonando uno existente.
- **Relevancia:** No existe necesidad de clonar objetos costosos en este flujo.
- **Decisión:** ❌ Descartado.

---

### 2.2 Patrones Estructurales

Estos patrones se ocupan de cómo se componen clases y objetos para formar estructuras más grandes.

#### Adapter
- **Intención:** Convertir la interfaz de una clase en otra que el cliente espera.
- **Relevancia:** 🔥 Crítica. Permite desacoplar `KudoService` de `RabbitTemplate`.
- **Decisión:** ✅ Recomendado.

#### Bridge
- **Intención:** Desacoplar una abstracción de su implementación.
- **Relevancia:** Similar a Adapter, pero Adapter encaja mejor para integrar librerías externas existentes.
- **Decisión:** ⚠️ Baja prioridad.

#### Composite
- **Intención:** Componer objetos en estructuras de árbol.
- **Relevancia:** No existen jerarquías complejas de parte-todo.
- **Decisión:** ❌ Descartado.

#### Decorator
- **Intención:** Añadir responsabilidades dinámicamente.
- **Relevancia:** Spring AOP ya cubre logging y transacciones de forma más limpia.
- **Decisión:** ❌ Descartado.

#### Facade
- **Intención:** Proveer una interfaz simplificada a un subsistema complejo.
- **Relevancia:** Útil si RabbitMQ se vuelve más complejo, pero Adapter resuelve mejor el DIP.
- **Decisión:** ⚠️ Media.

#### Flyweight
- **Intención:** Compartir estado para soportar gran cantidad de objetos.
- **Relevancia:** No hay problemas de memoria por objetos repetidos.
- **Decisión:** ❌ Descartado.

#### Proxy
- **Intención:** Proveer un sustituto o marcador de posición.
- **Relevancia:** Spring ya lo utiliza internamente (CGLIB).
- **Decisión:** ❌ Descartado.

---

### 2.3 Patrones de Comportamiento

Estos patrones se enfocan en la comunicación entre objetos y asignación de responsabilidades.

#### Chain of Responsibility
- **Intención:** Pasar una solicitud por una cadena de manejadores.
- **Relevancia:** ✅ Alta. Ideal para dividir el flujo del consumer en pasos independientes.
- **Decisión:** ⚠️ Alternativa viable.

#### Command
- **Intención:** Encapsular una solicitud como un objeto.
- **Relevancia:** RabbitMQ ya gestiona la cola y ejecución diferida.
- **Decisión:** ⚠️ Media.

#### Iterator
- **Intención:** Acceder secuencialmente a una colección.
- **Relevancia:** No aplica al dominio actual.
- **Decisión:** ❌ Descartado.

#### Mediator
- **Intención:** Centralizar la interacción entre objetos.
- **Relevancia:** `KudoService` ya actúa como mediador implícito.
- **Decisión:** ⚠️ Baja.

#### Memento
- **Intención:** Capturar y restaurar estado.
- **Relevancia:** No se requiere funcionalidad de undo.
- **Decisión:** ❌ Descartado.

#### Observer
- **Intención:** Dependencia uno-a-muchos para notificar cambios.
- **Relevancia:** Spring `ApplicationEventPublisher` puede usarse para desacoplar efectos secundarios.
- **Decisión:** ⚠️ Media/Alta.

#### State
- **Intención:** Cambiar comportamiento según estado interno.
- **Relevancia:** `Kudo` es inmutable.
- **Decisión:** ❌ Descartado.

#### Strategy
- **Intención:** Definir una familia de algoritmos intercambiables.
- **Relevancia:** 🔥 Muy alta. Ideal para reglas de validación por categoría.
- **Decisión:** ✅ Recomendado.

#### Template Method
- **Intención:** Definir el esqueleto de un algoritmo.
- **Relevancia:** Útil, pero menos flexible que Chain of Responsibility.
- **Decisión:** ⚠️ Media.

#### Visitor
- **Intención:** Separar algoritmos de estructuras de objetos.
- **Relevancia:** No existe estructura estable que lo justifique.
- **Decisión:** ❌ Descartado.

---

## 3. Selección y Justificación de Patrones

### 3.1 Creacional: **Builder**
**Problema:** Modelo de dominio anémico y *Primitive Obsession*.  
**Solución:** Implementar un Builder real en `Kudo` con validaciones en `build()`.  
**Justificación:** Garantiza consistencia del dominio. Superior a Factory Method en este contexto.

---

### 3.2 Estructural: **Adapter (Hexagonal Port & Adapter)**
**Problema:** Violación de DIP por dependencias directas a RabbitMQ y Jackson.  
**Solución:** Introducir puertos (`KudoEventPublisher`) y adaptadores concretos.  
**Justificación:** Aisla el dominio de la infraestructura. Base de Clean Architecture.

---

### 3.3 Comportamiento: **Strategy**
**Problema:** Reglas de validación rígidas y propensas a `if/else`.  
**Solución:** Estrategias de validación por categoría.  
**Justificación:** Cumple OCP y permite escalar reglas sin modificar servicios existentes.

---

## 4. Resumen Comparativo

| Criterio | Arquitectura Actual (MVP) | Arquitectura Propuesta | Impacto |
|--------|---------------------------|------------------------|---------|
| Coupling | Alto | Bajo | Facilita migración y testing |
| SRP | Violado | Cumplido | Mayor mantenibilidad |
| Validación | Dispersa | Centralizada | Dominio más robusto |
| Escalabilidad | Limitada | Alta | Extensión sin regresiones |

---

## 5. Conclusión

La adopción de **Builder**, **Adapter** y **Strategy** transforma el sistema de un MVP acoplado a una arquitectura profesional, testable y evolutiva.

- **Adapter** otorga libertad de infraestructura  
- **Builder** garantiza integridad del dominio  
- **Strategy** permite escalar reglas de negocio  

Estos patrones introducen la **estructura mínima necesaria**, evitando sobre-ingeniería y preparando el sistema para crecimiento real.
