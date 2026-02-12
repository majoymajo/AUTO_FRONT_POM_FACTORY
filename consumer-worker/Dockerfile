# ---------------------------------------------------------------------------
# Stage 1: Build (requires mvnw generated via: mvn wrapper:wrapper)
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw package -Dmaven.test.skip=true -B

# ---------------------------------------------------------------------------
# Stage 2: Runtime
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN apk add --no-cache wget
RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -D appuser

COPY --from=builder /build/target/*.jar app.jar

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8081/ || exit 1

USER appuser

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
