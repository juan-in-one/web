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
# La imagen base trae el índice de paquetes de Alpine "congelado" a cuando
# se publicó el tag — con el tiempo eso acumula CVEs ya parcheadas río
# arriba (a diferencia de Debian, aquí SÍ hay parche para el 100% de lo
# encontrado). Se fuerza apk upgrade en cada build para no depender de
# cuándo Docker Hub vuelva a publicar el tag. Necesita usuario root
# temporalmente (la imagen ya corre como "nginx" por defecto) y se
# devuelve al usuario sin privilegios justo después.
USER root
RUN apk update && apk upgrade --no-cache
USER nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Fallback de SPA para que las rutas de React Router (/coche, /retos...)
# sobrevivan a un refresco de página — ver nginx.conf.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8080/ || exit 1
