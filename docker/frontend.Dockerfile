# Build context: repo root (see docker/docker-compose.yml)
#
# Estagios:
#   deps    -> instala as dependencias do npm (camada cacheavel)
#   test    -> roda o Vitest (unit + BDD) com relatorio JUnit, via flags de
#              linha de comando (sem alterar vite.config.js). Nao faz parte
#              da imagem final: a pipeline builda so este estagio
#              (--target test) e roda com "docker run" para extrair os
#              relatorios mesmo quando um teste falha.
#   build   -> gera o build de producao (dist/)
#   runtime -> ultimo estagio (o "docker build" sem --target usa este): igual
#              ao Dockerfile original, so o Nginx servindo o dist/

# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci

# ---- Test ----
FROM deps AS test
COPY frontend/ .
CMD ["npx", "vitest", "run", "--coverage", \
     "--reporter=default", "--reporter=junit", \
     "--outputFile.junit=/app/reports/junit.xml", \
     "--coverage.reportsDirectory=/app/reports/coverage"]

# ---- Build ----
FROM deps AS build
COPY frontend/ .
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---- Runtime ----
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
