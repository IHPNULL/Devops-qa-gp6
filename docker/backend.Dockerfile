# Build context: repo root (see docker/docker-compose.yml)

# ---- Build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline
COPY backend/src/ src/
RUN ./mvnw -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/grupo_6_gameeducator-0.0.1-SNAPSHOT.jar app.jar
ENV SPRING_PROFILES_ACTIVE=postgres
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
