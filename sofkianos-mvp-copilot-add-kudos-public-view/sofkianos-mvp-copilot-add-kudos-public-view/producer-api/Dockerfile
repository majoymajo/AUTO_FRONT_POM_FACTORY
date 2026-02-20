# ---------------------------------------------------------------------------
# Stage 1: Build
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw

# Descargar dependencias
RUN ./mvnw dependency:go-offline -B

# Compilar
COPY src src
RUN ./mvnw package -Dmaven.test.skip=true -B

# ---------------------------------------------------------------------------
# Stage 2: Runtime
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Instalar wget para el healthcheck
RUN apk add --no-cache wget
RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -D appuser

# Copiar el JAR compilado
COPY --from=builder /build/target/*.jar app.jar

# Healthcheck apuntando al puerto 8082
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8082/ || exit 1

USER appuser

# Exponer el puerto correcto
EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]