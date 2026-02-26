# ❓ AMBIGÜEDADES CRÍTICAS - RESPUESTAS REQUERIDAS

**Documento:** Discovery de preguntas bloqueantes  
**Fecha:** Febrero 2026  
**Responsable:** PM / Arquitecto de Software  
**Urgencia:** CRÍTICA - Bloquea 5 historias

---

## 🔴 AMBIGÜEDAD 1: ¿Cuál es la herramienta para Gestión de Secretos?

**Afecta:** US-003 (Gestión de secretos)  
**Impacto:** Bloquea implementación de vault  
**Complejidad:** Alta (afecta toda la infraestructura)

### Contexto
Actualmente, los secretos pueden estar:
- En `.env` (riesgo: expose en repo)
- En `docker-compose` (riesgo: visibles en logs)
- En variables de entorno (riesgo: poco auditables)

### Opciones Consideradas

#### OPCIÓN A: AWS Secrets Manager ✅ RECOMENDADO
```hcl
# Ventajas:
+ Integración nativa con AWS + Terraform
+ Rotación automática de secretos
+ Auditoría CloudTrail incluida
+ Cost: $0.4/secreto/mes + requests

# Desventajas:
- Requiere AWS IAM roles
- Menos portable que Vault

# Implementación:
1. Crear secreto en AWS Secrets Manager
2. IAM role para EC2 + aplicación
3. Cambiar .env → AWS SDK en aplicación
4. Terraform: aws_secretsmanager_secret + aws_secretsmanager_secret_version
```

#### OPCIÓN B: HashiCorp Vault
```hcl
# Ventajas:
+ Cloud-agnostic (AWS, GCP, Azure)
+ Rotación + auditoría completa
+ Integración Kubernetes-ready
+ Open-source option

# Desventajas:
- Requiere servidor separado
- Setup más complejo
- Cost: Self-hosted + mantenimiento

# Implementación:
1. Desplegar Vault en EC2 o Kubernetes
2. Autenticación: AppRole, JWT, etc.
3. Policy: Qué app accede a qué secreto
4. Terraform: Vault provider
```

#### OPCIÓN C: Sealed Secrets (Kubernetes-focused)
```bash
# Ventajas:
+ Para desarrollo / testing
+ Secretos encriptados en Git

# Desventajas:
- Requiere Kubernetes (no lo usan)
- No auditoria de acceso
- No rotación automática

# NO RECOMENDADO para producción
```

### DECISIÓN REQUERIDA

```markdown
## ✋ RESPONDER AHORA

Elegir herramienta para producción:

- [ ] **A) AWS Secrets Manager** (my recommendation)
      - Razón: Integración AWS, simple, seguro
      
- [ ] **B) HashiCorp Vault**
      - Razón: Cloud-agnostic, completo control
      
- [ ] **C) Otra**
      - Especificar: ________________________

**Responsable:** ________________  
**Aprobado:** ☐ SÍ  ☐ NO  
**Fecha:** __________________
```

---

## 🔴 AMBIGÜEDAD 2: ¿Cuál es la herramienta de Monitoreo Centralizado?

**Afecta:** US-007 (Monitoreo centralizado)  
**Impacto:** Bloquea observabilidad  
**Complejidad:** ALTA (requiere infraestructura nueva)

### Contexto
Actualmente:
- No hay logs centralizados
- No hay métricas de JVM
- No hay alertas automáticas
- No hay dashboard visible

### Opciones Consideradas

#### OPCIÓN A: ELK Stack (Elasticsearch + Logstash + Kibana)
```yaml
# Componentes:
- Elasticsearch: almacenamiento de logs
- Logstash/Filebeat: ingestión desde servicios
- Kibana: visualización + alertas

# Ventajas:
+ Open-source (ElasticSearch community)
+ Búsqueda full-text potente
+ Dashboards hermosos
+ Alertas bien integradas

# Desventajas:
- Alto consumo de CPU/RAM
- Curva de aprendizaje
- Cost: Self-hosted + mantenimiento

# Setup aprox:
docker run -d -p 9200:9200 -p 9600:9600 -e ELASTIC_PASSWORD=... docker.elastic.co/elasticsearch/elasticsearch:8.0.0
docker run -d -p 5601:5601 -e ELASTICSEARCH_HOSTS=http://elasticsearch:9200 docker.elastic.co/kibana/kibana:8.0.0

# Integración Java:
- Spring Boot Actuator + Logback → Elasticsearch
- Spring Cloud Sleuth → trace IDs
```

#### OPCIÓN B: Prometheus + Grafana
```yaml
# Componentes:
- Prometheus: scrape de métricas (time-series DB)
- Grafana: visualización + alertas

# Ventajas:
+ Más ligero que ELK
+ Estándar cloud-native / Kubernetes
+ Excelente para métricas de JVM
+ Community muy activa

# Desventajas:
- No tan potente para logs (necesita Loki)
- Curva aprendizaje Prometheus query language (PromQL)

# Setup aprox:
docker run -d -p 9090:9090 prom/prometheus:latest
docker run -d -p 3000:3000 grafana/grafana:latest

# Integración Java:
- Spring Boot Actuator → Micrometer → Prometheus
- Librería: spring-boot-starter-actuator + micrometer-registry-prometheus
```

#### OPCIÓN C: Combo Prometheus (métricas) + Loki (logs) + Grafana
```yaml
# Mejor de ambos mundos:
- Prometheus: métricas JVM
- Loki: logs centralizados (más ligero que ES)
- Grafana: todo visualizado en un lugar

# Ventajas:
+ Loki es más ligero que Elasticsearch
+ Prometheus es estándar cloud-native
+ Grafana unifica ambos

# Desventajas:
- Más componentes = más complejidad
- Ainda requiere setup inicial

# Estimado: 1 sprint de setup
```

#### OPCIÓN D: Managed (DataDog, New Relic, Splunk)
```yaml
# Ventajas:
+ Totalmente managed (sin ops)
+ Soporte profesional
+ Todos los features incluidos

# Desventajas:
- Cost: $50-500/mes (según escala)
- Vendor lock-in
- Data privacy: storing in vendor servers

# Para MVP probablemente NO
```

### DECISIÓN REQUERIDA

```markdown
## ✋ RESPONDER AHORA

¿Qué stack de monitoreo elegimos?

- [ ] **A) ELK Stack** (Elasticsearch + Logstash + Kibana)
      - Razón: ________________________
      
- [ ] **B) Prometheus + Grafana** (+ Loki opcional)
      - Razón: ________________________
      
- [ ] **C) Combo Prometheus + Loki + Grafana**
      - Razón: ________________________
      
- [ ] **D) Herramienta managed (DataDog, New Relic)**
      - Razón: ________________________

**Responsable:** ________________  
**Aprobado:** ☐ SÍ  ☐ NO  
**Fecha:** __________________

**Decisión también aplica a:**
- Dónde almacenar logs históricos
- Cuánto tiempo retener datos (30 días? 1 año?)
- Presupuesto IT disponible para herramientas
```

---

## 🔴 AMBIGÜEDAD 3: ¿Qué normativas de Compliance aplican?

**Afecta:** US-011 (Compliance en pipeline)  
**Impacto:** Define scope de seguridad  
**Complejidad:** ALTA (legal + técnico)

### Contexto
No está claro qué regulaciones aplican al proyecto.

### Regulaciones Posibles

#### OPCIÓN A: GDPR (Regulación EU)
```markdown
⚠️ Aplicable si:
- Usuarios/clientes en EU
- Procesar datos personales de EU citizens
- Almacenar cualquier dato identificable

Requisitos técnicos:
- [ ] Data residency: datos en EU-only (AWS eu-west-1)
- [ ] Encryption at rest + in transit
- [ ] Right to be forgotten: script de borrado de datos
- [ ] Consent management: audit de quién consintió qué
- [ ] DPA signed: Data Processing Agreement con proveedores
- [ ] Auditoría anual: GDPR compliance report

Estimado: 2-3 sprints implementar + certif
```

#### OPCIÓN B: SOC2 Type II
```markdown
⚠️ Aplicable si:
- Clientes B2B piden SOC2
- Datos financieros o críticos
- Acceso remoto a sistemas cliente

Requisitos técnicos:
- [ ] Access controls: quién puede ver qué (RBAC)
- [ ] Encryption: data at rest & transit
- [ ] Change management: control de cambios
- [ ] Incident response: plan de respuesta
- [ ] Auditoría externa: anual por 6+ meses

Estimado: 1-2 sprints setup + auditoría $5-10k/año
```

#### OPCIÓN C: PCI-DSS (Pagos)
```markdown
⚠️ Aplicable si:
- Procesar tarjetas de crédito
- Almacenar datos de tarjetas

Requisitos técnicos:
- [ ] PCI scope minimizado: tokenizar payos
- [ ] Encriptación: todas las transacciones
- [ ] Validaciones: 11-12 requisitos PCI

Estimado: 2-3 sprints + validación $2-5k/año
NO RECOMENDADO para MVP (usar PayPal/Stripe)
```

#### OPCIÓN D: Solo políticas internas
```markdown
✅ Si:
- Producto MVP
- Users: solo internos o testing
- No datos financieros/personales críticos

Requisitos mínimos:
- [ ] Password policy enforced
- [ ] Access logs auditados
- [ ] Incident response plan documentado
- [ ] Backup & recovery tested

Estimado: 1 sprint
```

### DECISIÓN REQUERIDA

```markdown
## ✋ RESPONDER AHORA

¿Qué regulaciones/normas aplican a Sofkianos?

- [ ] **A) GDPR** (datos de usuarios EU)
      - ¿Tienen usuarios en EU? SÍ / NO
      
- [ ] **B) SOC2 Type II** (clientes B2B lo piden)
      - ¿Clientes lo requieren? SÍ / NO
      
- [ ] **C) PCI-DSS** (procesamos tarjetas)
      - ¿Procesamos pagos directamente? SÍ / NO
      
- [ ] **D) Solo políticas internas** (MVP)
      - ¿Es MVP sin reqs regulatorios? SÍ / NO
      
- [ ] **E) Múltiples** (especificar combinación)
      - Cuáles: GDPR + SOC2 / GDPR sola / etc

**Responsable:** ________________  
**Aprobado:** ☐ SÍ  ☐ NO  
**Fecha:** __________________

**Nota:** Decisión afecta timeline, presupuesto, y equipo legal requerido
```

---

## 🔴 AMBIGÜEDAD 4: ¿SLA de Backups (RPO/RTO)?

**Afecta:** US-010 (Backups y recuperación)  
**Impacto:** Define frequencia y costo de infraestructura  
**Complejidad:** MEDIA

### Contexto
- RPO (Recovery Point Objective): ¿Cuántos datos podemos perder? (1h? 1día?)
- RTO (Recovery Time Objective): ¿Cuánto tiempo sin BD es aceptable? (5min? 1h?)

### Opciones Consideradas

#### OPCIÓN A: Backups Diarios (Development/Staging)
```yaml
# Características:
Frecuencia: 1x diario (02:00 UTC)
RPO: 24 horas (perder hasta 1 día de datos)
RTO: 15 minutos (recuperar en 15 min)
Storage: AWS S3
Retención: 30 días

# Cost:
S3 storage: $0.023/GB/mes (1GB = $0.023)
Script cron: $0 (EC2 cron job)
Estimado total: $1-2/mes (pequeño DB)

# Implementación:
```bash
0 2 * * * pg_dump -h $DB_HOST -U $USER $DB | gzip > backup_$(date +\\%Y\\%m\\%d).sql.gz
aws s3 cp backup_*.sql.gz s3://sofkianos-backups/
```

# ✅ Recomendado para staging
```

#### OPCIÓN B: Hourly Backups (Production) 
```yaml
# Características:
Frecuencia: 1x cada hora
RPO: 1 hora (perder hasta 1h de datos)
RTO: 30 minutos (recuperar en 30 min)
Storage: AWS S3 + replicado a otra región
Retención: 7 días (rolling)

# Cost:
S3 storage: $0.046/GB/mes (réplica adicional)
RDS snapshots: $0.10/GB (más rápido que pg_dump)
Estimado: $2-3/mes

# ✅ Standard para producción
```

#### OPCIÓN C: Continuous Replication (Premium)
```yaml
# Características:
Frecuencia: Continuous (real-time)
RPO: Casi cero (segundos)
RTO: 5 minutos
Storage: Standby DB en otra AZ

# Cost:
RDS Multi-AZ: $100-200/mes (duplica costo DB)
Replicación automática: $0 (incluido en Multi-AZ)

# ⚠️ Caro pero máxima seguridad
```

### DECISIÓN REQUERIDA

```markdown
## ✋ RESPONDER AHORA

¿Cuál es el SLA de backups requerido?

Considerar:
- ¿Cuántos datos podemos perder? (1h? 1día?)
- ¿Cuánto tiempo sin servicio es aceptable? (5min? 30min? 1h?)

- [ ] **A) Daily Backups** (RPO 24h, RTO 15min)
      - Cost: ~$1-2/mes
      - Para: Staging / Non-critical
      
- [ ] **B) Hourly Backups** (RPO 1h, RTO 30min)
      - Cost: ~$2-3/mes
      - Para: Production estándar
      
- [ ] **C) Continuous Replication** (RPO ~0, RTO 5min)
      - Cost: ~$100/mes
      - Para: Critical services

**Responsable:** ________________  
**Aprobado:** ☐ SÍ  ☐ NO  
**Fecha:** __________________
```

---

## 🔴 AMBIGÜEDAD 5: ¿Alcance de Smoke Tests?

**Afecta:** US-006 (Smoke tests post-deploy)  
**Impacto:** Define qué se valida después de deploy  
**Complejidad:** BAJA

### Contexto
Smoke tests = validaciones rápidas que verifican que el sistema básicamente funciona.

### Opciones Consideradas

#### OPCIÓN A: Solo Health Endpoints (Mínimo)
```bash
# Qué testear (3 tests, ~10 segundos):
✓ GET /health (producer) → 200 OK
✓ GET /health (consumer) → 200 OK
✓ GET / (frontend) → 200 OK

# Ventajas:
- Muy rápido (< 30s)
- Baja falsa positivos

# Desventajas:
- No verifica funcionalidad real
- ⚠️ Si API está "up" pero BD no conecta, no lo detecta

# Para uso: Dev / Staging (rápida validation)
```

#### OPCIÓN B: Health + Flujo Básico (Recomendado)
```bash
# Qué testear (6-8 tests, ~30-45 segundos):
✓ GET /health (todos los servicios)
✓ POST /api/kudo (crear kudo)
✓ GET /api/kudo (listar kudos)
✓ GET / (frontend carga)
✓ PostgreSQL connection
✓ RabbitMQ connectivity

# Ventajas:
- Verifica funcionalidad real
- Detecta problemas de BD/messaging

# Desventajas:
- Poco más lento (~40s)

# Para uso: Producción (más confiable)
```

#### OPCIÓN C: Full End-to-End (Exhaustivo)
```bash
# Qué testear (15+ tests, ~2-3 minutos):
- Todo lo anterior +
- Login / Auth flow
- Database transactions
- Message queue processing
- UI rendering checks
- Performance baseline (latencia < 500ms)

# Ventajas:
- Máxima confianza

# Desventajas:
- Lento para cada deploy
- Requiere test data setup

# Para uso: Nightly tests (no cada deploy)
```

### DECISIÓN REQUERIDA

```markdown
## ✋ RESPONDER AHORA

¿Qué alcance de smoke tests después de deploy?

- [ ] **A) Mínimo: solo health endpoints**
      - Tiempo: ~10s
      - Para: Dev (validación rápida)
      
- [ ] **B) Estándar: health + flujo básico** (RECOMENDADO)
      - Tiempo: ~30-40s
      - Para: Staging + Prod
      
- [ ] **C) Exhaustivo: full end-to-end**
      - Tiempo: ~2-3 minutos
      - Para: Nightly / Pre-deploy en staging

**Responsable:** ________________  
**Aprobado:** ☐ SÍ  ☐ NO  
**Fecha:** __________________
```

---

## 📋 MATRIZ DE DECISIÓN RÁPIDA

```markdown
| # | Pregunta | Respuesta | Responsable | Fecha |
|----|----------|-----------|-------------|-------|
| 1️⃣ | Vault: AWS Secrets / HashiCorp / Otra | _____ | _____ | _____ |
| 2️⃣ | Monitoreo: ELK / Prometheus+Loki / Managed | _____ | _____ | _____ |
| 3️⃣ | Compliance: GDPR / SOC2 / PCI / Interna | _____ | _____ | _____ |
| 4️⃣ | Backups SLA: Daily / Hourly / Continuous | _____ | _____ | _____ |
| 5️⃣ | Smoke tests: Mínimo / Estándar / Exhaustivo | _____ | _____ | _____ |
```

---

## 🚀 CÓMO USAR ESTE DOCUMENTO

1. **Imprime o copia en Jira**
2. **Reúne PM + Arquitecto + DevOps**
3. **Responde las 5 preguntas en esta sesión**
4. **Crea Jira tickets con decisiones**
5. **Desbloquea 5 historias para desarrollo**

---

**Documento:** AMBIGUEDADES_HU_DEPLOY.md  
**Status:** ⏳ PENDIENTE DE RESPUESTA  
**Urgencia:** 🔴 CRÍTICA (bloquea 5 historias)  
**Fecha Vencimiento:** Antes de iniciar Sprint 1
