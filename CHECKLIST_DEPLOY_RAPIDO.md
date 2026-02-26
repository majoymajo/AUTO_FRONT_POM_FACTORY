# 🚀 QUICK REFERENCE: Checklists de Despliegue

## ⚡ ACCIONES INMEDIATAS (Hoy)

### 1️⃣ Corregir Jenkinsfile
```diff
- dir('fronted') {  # ← TYPO
+ dir('frontend') {
      sh 'npm ci'
  }
```
**Ubicación:** `/frontend/ci/Jenkinsfile:20`

---

### 2️⃣ Documentar BD en Producción
```yaml
# PENDIENTE DE RESPUESTA:
# ¿Dónde está PostgreSQL en docker-compose.prod.yml?
# Opciones: a) RDS en AWS, b) Terraform, c) Otro lugar
```

---

### 3️⃣ Seguridad: Restringir SSH en AWS
```hcl
# CAMBIAR EN /aws/main.tf:
ingress {
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]  # ❌ INSEGURO
}

# A:
ingress {
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/8"]  # ✅ Solo VPC interna o bastion
}
```

---

## 📋 RESPONDER ESTAS 5 PREGUNTAS

Crítico para desbloquear 5 historias:

```markdown
❓ PREGUNTA 1: Gestión de Secretos (US-003)
Opción elegida:
- [ ] AWS Secrets Manager
- [ ] HashiCorp Vault
- [ ] Sealed Secrets (Kubernetes)

❓ PREGUNTA 2: Monitoreo Centralizado (US-007)
Opción elegida:
- [ ] ELK Stack (Elasticsearch + Logstash + Kibana)
- [ ] Prometheus + Grafana
- [ ] DataDog
- [ ] Otro: _______________

❓ PREGUNTA 3: Compliance (US-011)
Normas aplicables:
- [ ] GDPR (datos EU)
- [ ] SOC2 Type II
- [ ] PCI-DSS (pagos)
- [ ] Solo políticas internas

❓ PREGUNTA 4: SLA Backups (US-010)
Frecuencia:
- [ ] Diario (24h RPO, 15min RTO)
- [ ] Cada 6 horas (6h RPO, 30min RTO)
- [ ] Hourly (1h RPO, 10min RTO)

Otro: _______________

❓ PREGUNTA 5: Smoke Tests (US-006)
Alcance:
- [ ] Solo health endpoints (2 tests)
- [ ] Health + flujo básico (5 tests)
- [ ] Completo end-to-end (10+ tests)
```

---

## ✅ PRE-DEPLOY CHECKLIST (30 min antes de deploy)

**Copy-paste en Jira/Confluence antes de cada despliegue:**

### STATUS: ⏳ PENDIENTE / ✅ READY / ❌ BLOQUEADO

```markdown
# Deploy Checklist - [Fecha] - [Versión]

## CÓDIGO & TESTS (10 min)
- [ ] Rama main: merge aprobado
- [ ] `npm test` o `mvn test`: ✅ PASSING
- [ ] Cobertura: > 80%
- [ ] Linting (`eslint`, `checkstyle`): ✅ PASSING

## SEGURIDAD (5 min)
- [ ] `trivy image`: 0 CRITICAL, máx 2 HIGH
- [ ] Scan dependencias: ✅ OK
- [ ] No hay secretos en código (check: `.env`, `secrets/`)
- [ ] Credentials rotadas: < 30 días

## INFRAESTRUCTURA (10 min)
- [ ] `terraform validate`: ✅ OK
- [ ] `terraform plan`: sin `destroy` accidental
- [ ] Backup BD: COMPLETADO (timestamp: _______)
- [ ] Capacidad: CPU < 85%, RAM < 80%

## STAGING PRE-FLIGHT (20 min)
- [ ] Deploy staging: ✅ EXITOSO
- [ ] `./scripts/smoke-tests.sh`: 100% PASSING
- [ ] Performance tests: dentro de SLI
- [ ] Logs: sin [ERROR] / [FATAL]
- [ ] Visual check: UI carga correctamente

## APROBACIONES
- [ ] PM / PO: APROBÓ
- [ ] Arquitecto: REVISÓ
- [ ] DevOps: VALIDÓ infraestructura

## NOTIFICACIONES
- [ ] Team notificado en Slack
- [ ] Release notes preparadas
- [ ] Runbook de rollback disponible
```

---

## 🚨 POST-DEPLOY CHECKLIST (Primeras 2 horas)

### MINUTO 0-15: Deploy & Sanidad
```bash
# Ejecutar después del deploy:
docker ps --format "table {{.Names}}\t{{.Status}}"
# Resultado esperado: Todos en "Up"

curl -s http://producer-api:8082/health | jq .
# Resultado esperado: { "status": "UP" }

curl -s http://consumer-worker:8081/health | jq .
# Resultado esperado: { "status": "UP" }

psql -h $DB_HOST -U postgres -c "SELECT 1"
# Resultado esperado: 1
```

- [ ] Contenedores running
- [ ] Healthchecks: ✅ HEALTHY
- [ ] Base de datos accessible
- [ ] Logs: sin [ERROR]

### MINUTO 15-30: Funcionalidad Crítica
- [ ] Usuario CREA UN KUDO: ✅ EXITOSO (end-to-end)
- [ ] API responde con 201 / 400 (según input)
- [ ] Frontend carga sin JavaScript errors (F12 console)
- [ ] RabbitMQ: messages flowing (`rabbitmq-diagnostics queue_name_lengths`)

### MINUTO 30-60: Monitoreo
```bash
# Métricas esperadas:
# Error rate: < 1%
# Latencia p95: < 500ms
curl -s http://[service]:8080/metrics | grep http_requests_duration_seconds
```

- [ ] Error rate < 1%
- [ ] Latencia p95 < 500ms
- [ ] CPU < 70% (no en spike)
- [ ] Memory < 60% (no creciendo)

### MINUTO 60-120: Business Validation
- [ ] PM/Team valida features
- [ ] Usuarios NO reportan issues
- [ ] Analytics (si existen): comportamiento normal
- [ ] Alertas: NO disparan

### ❌ SI ALGO FALLA: ROLLBACK AUTOMÁTICO

```bash
# ROLLBACK RÁPIDO:
git checkout main
docker-compose down
docker-compose up -d

# O con Terraform:
terraform destroy -auto-approve
terraform apply

# Notificar en Slack:
# ⚠️ DEPLOY ROLLED BACK - Investigación en progreso
```

---

## 📊 HISTORIAS LISTAS PARA SPRINT (Score >= 15/18)

### ✅ LISTA AHORA (Con ajustes menores)

#### US-002: Mejorar docker-compose
- Score: 17/18 ✅
- DoD: `docker-compose config` válido
- DoD: `docker-compose up < 60s`
- DoD: Healthchecks pasan

#### US-009: Documentación de procesos
- Score: 17/18 ✅
- DoD: Checklist operacional completado
- DoD: DevOps team revisa
- DoD: Runbook probado

#### US-014: Validación de infraestructura
- Score: 16/18 ✅
- DoD: Pre-destroy validations automatizadas
- DoD: Backup completado antes de destroy

---

## ⚠️ HISTORIAS PARCIALMENTE LISTAS (Score 13-15/18)

### US-004: Escaneo de vulnerabilidades
```bash
# Criterio técnico específico:
trivy image --severity HIGH,CRITICAL elyriven/sofkianos-producer:latest
# Si CRITICAL > 0: FALLA (no deploya)
# Si HIGH > 2: FALLA (no deploya)
```

### US-006: Smoke tests
```bash
#!/bin/bash
# /scripts/smoke-tests.sh

PASSED=0
FAILED=0

# Test 1: Producer Health
response=$(curl -s -w "%{http_code}" -o /dev/null http://producer-api:8082/health)
[ "$response" -eq 200 ] && PASSED=$((PASSED+1)) || FAILED=$((FAILED+1))

# Test 2: Consumer Health
response=$(curl -s -w "%{http_code}" -o /dev/null http://consumer-worker:8081/health)
[ "$response" -eq 200 ] && PASSED=$((PASSED+1)) || FAILED=$((FAILED+1))

# Test 3: Frontend
response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:5173/)
[ "$response" -eq 200 ] && PASSED=$((PASSED+1)) || FAILED=$((FAILED+1))

# Test 4: API Endpoint
response=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"from":"test","to":"test","message":"test"}' \
  -w "%{http_code}" -o /dev/null http://producer-api:8082/api/kudo)
[ "$response" -eq 201 ] || [ "$response" -eq 400 ] && PASSED=$((PASSED+1)) || FAILED=$((FAILED+1))

echo "✅ SMOKE TESTS: $PASSED passed, $FAILED failed"
[ $FAILED -eq 0 ] || exit 1
```

### US-008: Terraform mejorado
- Completar `aws/main.tf`: RDS + RabbitMQ
- Agregar: `terraform validate`, `terraform plan`, rollback test
- Score sería: 18/18 ✅

### US-010: Backups
- Definir SLA: RPO 24h, RTO 15min
- Script: `pg_dump` diario a S3
- Test: Restauración mensual

### US-012: Migraciones
- Usar Flyway (ya integrado en Spring Boot)
- Documentar: naming convention, reversión
- Test: rollback en staging

### US-013: Performance
- Integrar Gatling/JMeter al pipeline
- Definir SLI: Latencia p95 < 500ms
- Score sería: 18/18 ✅

---

## ❌ HISTORIAS NO LISTAS (Require rescrutinio)

### US-001: Refactorizar Dockerfile
**Acción:** Dividir en 3:
- US-001a: Producer API
- US-001b: Consumer Worker
- US-001c: Frontend

---

### US-003: Gestión de secretos
**Acción:** Discovery + división
- US-003a: Setup Vault (AWS Secrets Manager)
- US-003b: Migrar secretos existentes
- US-003c: Auditar acceso

---

### US-005: Jenkinsfile mejorado
**Acción:** Dividir en 3:
- US-005a: Agregar linting
- US-005b: Agregar security scans  **[Este ya existe como US-004]**
- US-005c: Agregar smoke tests  **[Este ya existe como US-006]**

---

### US-007: Monitoreo centralizado
**Acción:** Dividir en 4:
- US-007a: Centralizar logs (ELK)
- US-007b: Métricas JVM (Prometheus)
- US-007c: Errores frontend (Sentry)
- US-007d: Dashboards + alertas (Grafana)

---

### US-011: Compliance en pipeline
**Acción:** Discovery
- ¿GDPR? ¿SOC2? ¿PCI-DSS?
- Luego dividir en historias específicas

---

## 🎯 ROADMAP RECOMENDADO

### SEMANA 1: Críticos
- [ ] Corregir typo Jenkinsfile
- [ ] Documentar BD en Prod
- [ ] Restringir SSH en AWS
- [ ] Responder 5 preguntas clave

### SEMANA 2-3: Refactorización HU
- [ ] Dividir US-001, US-005, US-007
- [ ] Mejorar criterios de aceptación
- [ ] Crear checklists por HU

### SPRINT 1 (Semanas 4-5)
- [ ] Implementar Trivy scan (US-004)
- [ ] Crear smoke tests script (US-006)
- [ ] Mejorar docker-compose (US-002)

### SPRINT 2 (Semanas 6-7)
- [ ] Implementar Vault / Secrets Manager (US-003)
- [ ] Completar Terraform (US-008)
- [ ] Setup ELK o Prometheus (US-007a/b)

### SPRINT 3+
- [ ] Backup automation (US-010)
- [ ] Compliance setup (US-011)
- [ ] Monitoreo completo (US-007c/d)

---

## 📞 CONTACTOS Y ESCALACIÓN

```
⚠️ BLOQUEADOR TÉCNICO → DevOps Lead / Arquitecto
❓ AMBIGÜEDAD → PM / Product Owner
🔓 ACCESO / PERMISOS → Infrastructure Team
🐛 BUG EN PIPELINE → DevOps Lead / Jenkins Admin
```

---

**Generado:** Febrero 2026  
**Fuente:** AUDITORIA_HU_DEPLOY.md  
**Válido por:** Ciclo actual del proyecto  
**Última actualización:** [Auto-generado]
