# web

Frontend de la plataforma [juan-in-one](https://github.com/juan-in-one) — consume las APIs de los tres
microservicios (`car-api`, `sport-api`, `academy-api`) en una sola interfaz. Un único host de Ingress fanea
por prefijo de ruta (`/api/car-api/...`), así que el frontend solo llama a rutas relativas — sin CORS en
ningún sitio, ni en local ni en producción.

Stack: React 19 + TypeScript + Vite. Servido en producción por `nginx-unprivileged` (sin privilegios de
root, sin shell en la imagen final).

## Desarrollo local

```bash
npm install
npm run dev
```

En local, Vite hace de proxy de `/api/*` hacia el clúster real (`juan-in-one.local`), así el código nunca
sabe si está hablando con el backend local o el desplegado.

## Tests

```bash
npm run test
npm run test:coverage   # con informe de cobertura
```

## CI/CD

- **`pr-checks.yml`** corre en cada PR: lint (oxlint), Vitest con cobertura, Gitleaks, Dependency Review, y
  un build + escaneo de la imagen de prueba que **no puede publicar nada** — no hay ni login a GHCR en ese
  workflow.
- **`ci.yml`** corre solo al fusionar a `main`: los mismos escaneos (bloqueantes: Trivy, ZAP), build, firma
  de la imagen con Cosign (keyless) + SBOM con Syft, publicación en GHCR, y DAST contra el contenedor real.
- `main` está protegida: solo se puede fusionar vía PR desde una rama `feat/*`, con los checks de arriba en
  verde.

Ver [juan-in-one/.github](https://github.com/juan-in-one/.github) para el patrón compartido con las APIs, y
el [README de la organización](https://github.com/juan-in-one) para la arquitectura de toda la plataforma
(GitOps, cadena de suministro firmada, observabilidad).
