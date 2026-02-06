# Copilot Instructions — Portfolio SPA

## Proyecto
SPA de portfolio personal desplegada en GitHub Pages con Angular 19+, backend serverless y pipeline SCA.

## Arquitectura
- **Monorepo**: `frontend/` (Angular) + `backend/` (Cloud Functions) + `infra/` (CI/CD, IaC)
- **Hosting**: GitHub Pages (static prerendered)
- **Backend**: Google Cloud Functions / Formspree (contact form)
- **Booking**: Cal.com embed (synced con Google Calendar)

## Convenciones de Código

### Angular (frontend/)
- SIEMPRE usar standalone components (NO NgModules)
- SIEMPRE usar signals para estado reactivo (`signal()`, `computed()`, `effect()`)
- SIEMPRE usar `inject()` en lugar de constructor injection
- SIEMPRE implementar `ChangeDetectionStrategy.OnPush`
- SIEMPRE lazy load routes con `loadComponent`
- SIEMPRE usar Reactive Forms (no Template-Driven)
- NUNCA usar `any` — tipar todo con interfaces en `models/`
- NUNCA subscribirse manualmente sin cleanup — usar `takeUntilDestroyed()` o `@ngneat/until-destroy`
- Nombrar archivos: `feature-name.component.ts`, `feature-name.service.ts`
- Componentes: prefijo `app-` en selector
- Servicios singleton en `core/services/`, providedIn: 'root'
- Componentes reutilizables en `shared/components/`

### Styling
- Tailwind CSS para layout y utilidades
- SCSS para custom properties y temas (`_themes.scss`)
- Mobile-first: diseñar para 320px primero, luego breakpoints
- Usar CSS custom properties para theming (dark/light)
- Animaciones: CSS preferido sobre JS, respetar `prefers-reduced-motion`

### TypeScript
- Strict mode habilitado
- No `any`, no `as` casting innecesario
- Interfaces sobre types cuando sea posible
- Enums → union types (`type Theme = 'light' | 'dark'`)
- Barrel exports (`index.ts`) por feature

### Backend (backend/)
- Validar TODOS los inputs con zod schemas
- Sanitizar HTML/scripts de inputs de usuario
- CORS: whitelist solo el dominio del portfolio
- Rate limiting por IP
- No exponer API keys en código — usar env variables
- Logging estructurado (JSON)

## Seguridad (SCA)
- `npm ci` (NUNCA `npm install` en CI)
- Dependencias con versiones exactas (`save-exact=true`)
- GitHub Actions pinneadas por SHA completo
- CSP meta tag en index.html
- SRI para assets externos
- No eval(), no innerHTML sin sanitizar
- `rel="noopener noreferrer"` en links externos

## Testing
- Unit tests con Jasmine/Karma (Angular default)
- Coverage mínimo: 80%
- Nombrar tests: `describe('ComponentName')` → `it('should [behavior]')`
- Mock servicios con `jasmine.createSpyObj`
- E2E con Playwright (opcional)

## Git
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `ci:`
- Scope por área: `feat(portfolio):`, `fix(contact):`, `ci(sca):`
- PRs requieren: CI verde + code review
- Branch naming: `feat/feature-name`, `fix/bug-name`

## Estructura de Respuesta
Cuando generes código para este proyecto:
1. Indica en qué archivo va (`frontend/src/app/features/...`)
2. Usa imports relativos dentro del mismo feature
3. Usa path aliases (`@core/`, `@shared/`, `@features/`) para cross-feature
4. Incluye el spec file correspondiente
5. Actualiza `app.routes.ts` si es una nueva ruta
