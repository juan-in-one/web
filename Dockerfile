FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Imagen "unprivileged": ya viene configurada para correr como usuario
# no-root y escuchar en el puerto 8080 (no el 80, privilegiado), con todos
# sus ficheros temporales bajo /tmp — encaja con el mismo securityContext
# no-root + readOnlyRootFilesystem que usan car-api/sport-api.
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8080/ || exit 1
