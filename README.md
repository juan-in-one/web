# web

Frontend de la plataforma [juan-in-one](https://github.com/juan-in-one) — consume las APIs de los demás
microservicios (`car-api`, `sport-api`, `academy-api`, ...) en una sola interfaz.

Parte del stack de aprendizaje DevOps/DevSecOps/GitOps: Kubernetes + Helm + GitHub Actions (CI) + ArgoCD (CD)
sobre un clúster local en OrbStack.

Stack: React + TypeScript + Vite.

## Estado

v0 — scaffold base, sin conectar todavía a ningún backend real. Se irá conectando a `car-api` a medida que
avance el roadmap (ver `wiki/projects/juan-in-one.md` en el vault).

## Desarrollo local

```bash
npm install
npm run dev
```
