# Build context: repo root (see docker/docker-compose.yml)
#
# Imagem que RODA a suite Cucumber (nivel de API REST) de automation/api-tests
# contra um backend real, ja de pe no perfil "automation" (ver
# automation/docker-compose.automation.yml). Nao publica nada: e usada so
# pela pipeline do Jenkins para validar o backend construido nesta mesma build.

FROM eclipse-temurin:21-jdk AS deps
WORKDIR /app
COPY automation/api-tests/.mvn/ .mvn/
COPY automation/api-tests/mvnw automation/api-tests/pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

FROM deps AS runtime
COPY automation/api-tests/src/ src/
RUN ./mvnw -B test-compile

# http://backend:8080 e o nome do servico backend na rede do Docker Compose
# (ver docker/docker-compose.yml + automation/docker-compose.automation.yml).
# Para apontar para outro endereco: docker run <imagem> -Dautomation.baseUrl=http://outro:porta
ENTRYPOINT ["./mvnw", "-B", "test"]
CMD ["-Dautomation.baseUrl=http://backend:8080"]
