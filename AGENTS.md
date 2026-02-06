# AGENTS.md — Portfolio SPA

## Contexto del Proyecto
Este es un portfolio personal SPA desplegado en GitHub Pages.
- **Frontend**: Angular 19+ (standalone, signals, prerendering)
- **Backend**: Serverless functions (contact form, GitHub API proxy)
- **Infra**: GitHub Actions CI/CD con pipeline SCA completo

## Estructura del Monorepo
```
frontend/   → Angular SPA (npm workspace)
backend/    → Cloud Functions (npm workspace)
infra/      → GitHub Actions, Dependabot, scripts
```

## Instrucciones para Agentes AI

### Al modificar frontend/
1. Verificar que el componente es standalone
2. Usar signals para estado
3. Agregar/actualizar spec file
4. Verificar que la ruta está registrada en `app.routes.ts`
5. Ejecutar `ng lint` y `ng test` antes de commit

### Al modificar backend/
1. Validar inputs con zod
2. Verificar CORS configuration
3. Agregar/actualizar tests
4. No hardcodear secrets

### Al modificar infra/
1. Verificar que Actions usan SHA pins
2. No agregar permisos innecesarios (principle of least privilege)
3. Verificar que Dependabot cubre el nuevo path

### Al agregar dependencias
1. Verificar licencia (MIT, Apache-2.0, BSD permitidas)
2. Verificar que no tiene vulnerabilidades conocidas (`npm audit`)
3. Usar versión exacta (`--save-exact`)
4. Justificar la necesidad (evitar dependency bloat)
5. Verificar tamaño del bundle impact

## Archivos Clave
- `frontend/src/app/app.routes.ts` — Routing principal
- `frontend/src/app/app.config.ts` — Providers globales
- `frontend/src/assets/data/*.json` — Datos estáticos
- `frontend/src/styles/_themes.scss` — Variables de tema
- `infra/.github/workflows/ci.yml` — Pipeline CI
- `infra/.github/dependabot.yml` — Config Dependabot

## No Modificar Sin Revisión
- `package-lock.json` (solo via `npm ci/install`)
- `.github/workflows/*.yml` (requiere review de seguridad)
- `angular.json` (configuración crítica del build)
- CSP meta tag en `index.html`
