# 🚀 whoami — Portfolio SPA

Portfolio personal como Single Page Application, desplegado en GitHub Pages con Angular 21, backend serverless y un pipeline SCA completo.

[![CI](https://github.com/tu-usuario/whoami/actions/workflows/ci.yml/badge.svg)](https://github.com/tu-usuario/whoami/actions/workflows/ci.yml)
[![Deploy](https://github.com/tu-usuario/whoami/actions/workflows/cd.yml/badge.svg)](https://github.com/tu-usuario/whoami/actions/workflows/cd.yml)
[![CodeQL](https://github.com/tu-usuario/whoami/actions/workflows/codeql.yml/badge.svg)](https://github.com/tu-usuario/whoami/actions/workflows/codeql.yml)

---

## Tabla de Contenidos

- [Demo](#demo)
- [Arquitectura](#arquitectura)
- [Tech Stack](#tech-stack)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Testing](#testing)
- [Build & Deploy](#build--deploy)
- [Seguridad (SCA)](#seguridad-sca)
- [PWA](#pwa)
- [Internacionalización](#internacionalización)
- [Convenciones](#convenciones)
- [Licencia](#licencia)

---

## Demo

> **Live:** [https://tu-usuario.github.io/whoami/](https://tu-usuario.github.io/whoami/)

---

## Arquitectura

```
┌────────────────────────────────────────────────────────┐
│                    GitHub Pages                         │
│              (Static Prerendered HTML)                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│   ┌──────────────┐   ┌──────────────┐   ┌───────────┐ │
│   │  Hero         │   │  Portfolio    │   │  Contact  │ │
│   │  Section      │   │  Grid+Filter │   │  Form     │ │
│   └──────────────┘   └──────────────┘   └─────┬─────┘ │
│                                                │       │
│   ┌──────────────┐   ┌──────────────┐          │       │
│   │  About       │   │  Booking     │          │       │
│   │  Skills+Exp  │   │  Cal.com     │          │       │
│   └──────────────┘   └──────────────┘          │       │
│                                                │       │
│          Angular 21 · Signals · SSR            │       │
└────────────────────────────────────────────────┼───────┘
                                                 │
                                    ┌────────────▼───────────┐
                                    │   Cloud Functions       │
                                    │  ┌──────────────────┐   │
                                    │  │ Contact Handler   │   │
                                    │  │ (zod + Resend)    │   │
                                    │  ├──────────────────┤   │
                                    │  │ GitHub Repos      │   │
                                    │  │ Proxy (cached)    │   │
                                    │  └──────────────────┘   │
                                    └─────────────────────────┘
```

---

## Tech Stack

| Capa       | Tecnología                                                  |
| ---------- | ----------------------------------------------------------- |
| Frontend   | Angular 21, Standalone Components, Signals, SSR Prerender   |
| Styling    | Tailwind CSS v4, SCSS, CSS Custom Properties (dark/light)   |
| Testing    | Vitest, jsdom                                               |
| Backend    | Node.js 22, ESM, zod validation                             |
| CI/CD      | GitHub Actions (SHA-pinned), GitHub Pages                   |
| SCA        | CodeQL, Dependency Review, Dependabot, SBOM (CycloneDX)    |
| PWA        | Angular Service Worker, ngsw-config                         |
| Linting    | ESLint (angular-eslint), Prettier                           |
| Git        | Husky, lint-staged, commitlint (Conventional Commits)       |
| i18n       | Custom I18nService con signals (ES/EN)                      |

---

## Estructura del Proyecto

```
whoami/
├── .github/
│   ├── copilot-instructions.md     # Instrucciones para GitHub Copilot
│   ├── dependabot.yml              # Dependabot config
│   ├── instructions/               # Context-specific Copilot instructions
│   │   ├── angular.instructions.md
│   │   ├── security.instructions.md
│   │   ├── styling.instructions.md
│   │   └── testing.instructions.md
│   ├── specs/
│   │   └── tasks.md                # Task tracking
│   └── workflows/
│       ├── ci.yml                  # Lint + Test + Build
│       ├── cd.yml                  # Deploy a GitHub Pages
│       ├── codeql.yml              # SAST scanning
│       ├── dependency-review.yml   # PR dependency review
│       ├── lighthouse.yml          # Lighthouse CI gate
│       └── sbom.yml                # SBOM generation
│
├── frontend/portfolio-spa/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Servicios singleton
│   │   │   │   └── services/
│   │   │   │       ├── theme.service.ts
│   │   │   │       ├── seo.service.ts
│   │   │   │       ├── contact.service.ts
│   │   │   │       └── i18n.service.ts
│   │   │   ├── features/           # Feature components (lazy loaded)
│   │   │   │   ├── hero/
│   │   │   │   ├── about/          # + skills/, timeline/
│   │   │   │   ├── portfolio/      # + project-card/, project-filter/
│   │   │   │   ├── contact/        # + contact-form/, social-links/
│   │   │   │   └── booking/        # + calendar-embed/
│   │   │   ├── shared/             # Componentes/directivas/pipes reutilizables
│   │   │   │   ├── animations/
│   │   │   │   ├── components/     # navbar, footer, theme-toggle, skeleton
│   │   │   │   ├── directives/     # animate-on-scroll
│   │   │   │   └── pipes/          # translate
│   │   │   ├── models/             # Interfaces TypeScript
│   │   │   ├── app.routes.ts       # Routing (lazy loadComponent)
│   │   │   └── app.config.ts       # Providers globales
│   │   ├── assets/
│   │   │   ├── data/               # JSON estáticos (projects, skills, etc.)
│   │   │   └── i18n/               # Archivos de traducción (en.json, es.json)
│   │   └── styles/
│   │       └── _themes.scss        # CSS custom properties (light/dark)
│   ├── angular.json
│   ├── lighthouserc.yml
│   ├── lighthouse-budget.json
│   └── ngsw-config.json            # Service Worker config
│
├── backend/
│   ├── functions/
│   │   ├── contact/                # Contact form handler
│   │   └── github-repos/           # GitHub API proxy (cached)
│   └── shared/                     # CORS, rate-limiter, sanitizer
│
├── AGENTS.md                       # Instrucciones para agentes AI
├── commitlint.config.mjs
├── .nvmrc                          # Node 22
├── .npmrc                          # save-exact, audit
└── package.json                    # npm workspaces root
```

---

## Requisitos

- **Node.js** ≥ 22 (ver [.nvmrc](.nvmrc))
- **npm** ≥ 10
- **Git** ≥ 2.30

```bash
nvm use    # Activa la versión de Node del proyecto
```

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/whoami.git
cd whoami

# Instalar todas las dependencias (root + workspaces)
npm ci

# Husky se configura automáticamente via prepare script
```

> **Nota:** Se usa `npm ci` (no `npm install`) para garantizar reproducibilidad con el lockfile.

---

## Desarrollo

### Frontend

```bash
cd frontend/portfolio-spa

# Servidor de desarrollo con HMR
npm start
# → http://localhost:4200

# Lint
npm run lint

# Format
npm run format
```

### Backend

```bash
cd backend

# Build
npm run build

# Tests
npm test
```

---

## Testing

### Frontend (Vitest + jsdom)

```bash
cd frontend/portfolio-spa

# Ejecutar todos los tests
npm test

# Ejecutar un archivo específico
npx vitest run src/app/core/services/theme.service.spec.ts
```

**Cobertura actual:** 188 tests en 22 archivos de test.

### Backend (Vitest)

```bash
cd backend
npm test
```

**Cobertura actual:** 30 tests en 5 archivos de test.

### Convenciones de tests

- Estructura: `describe('NombreComponente')` → `it('should [comportamiento]')`
- Mocking: `vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()`
- Coverage mínimo: 80%
- Cada componente/servicio tiene su `.spec.ts` correspondiente

---

## Build & Deploy

### Build de producción

```bash
cd frontend/portfolio-spa
npx ng build --configuration=production
```

El output se genera en `dist/portfolio-spa/browser/` con:
- Prerendering de todas las rutas (SSR)
- Output hashing para cache busting
- Service Worker para PWA
- Bundle budgets: warn 500kB / error 1MB

### Deploy

El deploy a GitHub Pages es automático vía [cd.yml](.github/workflows/cd.yml) al hacer push a `main`.

Se incluye `404.html` para SPA routing (deep links).

---

## Seguridad (SCA)

El proyecto implementa un pipeline de seguridad completo:

| Control                 | Workflow                          | Trigger                  |
| ----------------------- | --------------------------------- | ------------------------ |
| `npm audit`             | [ci.yml](.github/workflows/ci.yml) | Push / PR               |
| CodeQL (SAST)           | [codeql.yml](.github/workflows/codeql.yml) | Push / PR / Semanal |
| Dependency Review       | [dependency-review.yml](.github/workflows/dependency-review.yml) | PR |
| Dependabot              | [dependabot.yml](.github/dependabot.yml) | Semanal             |
| SBOM (CycloneDX)        | [sbom.yml](.github/workflows/sbom.yml) | Release              |
| Lighthouse CI           | [lighthouse.yml](.github/workflows/lighthouse.yml) | PR (frontend) |

### Prácticas de seguridad

- Todas las GitHub Actions pinneadas por **SHA completo** (no tags)
- Dependencias con **versiones exactas** (`save-exact=true`)
- `npm ci` en CI (nunca `npm install`)
- CSP meta tag en `index.html`
- `rel="noopener noreferrer"` en todos los links externos
- Inputs sanitizados (backend: zod + sanitizer, frontend: Angular DomSanitizer)
- Honeypot anti-spam en formulario de contacto
- Rate limiting client-side y server-side
- CORS whitelist (solo dominio del portfolio)

---

## PWA

El portfolio funciona como Progressive Web App:

- **Service Worker** registrado via `@angular/service-worker`
- **Manifest** con iconos (72px–512px), theme color, standalone display
- **Caching:** App shell (prefetch), assets (lazy), API data (freshness con 3s timeout)
- **Offline:** Contenido cacheado disponible sin conexión

---

## Internacionalización

Soporte para **español** (default) e **inglés**:

- `I18nService` con signals para reactividad
- Detección automática del idioma del navegador
- Persistencia de preferencia en `localStorage`
- `TranslatePipe` para uso en templates
- Archivos de traducción en `src/assets/i18n/`

---

## Convenciones

### Commits

Se usa [Conventional Commits](https://www.conventionalcommits.org/) enforced con commitlint + Husky:

```
feat(portfolio): add project filtering by technology
fix(contact): handle rate limit error message
chore(deps): update angular to 21.1.3
docs: update README with PWA section
test(booking): add calendar embed timeout test
ci(sca): add CodeQL weekly schedule
```

### Branches

```
feat/feature-name
fix/bug-name
chore/task-name
```

### Angular

- **Standalone components** (sin NgModules)
- **Signals** (`signal()`, `computed()`, `effect()`) para estado reactivo
- **`inject()`** en lugar de constructor injection
- **`ChangeDetectionStrategy.OnPush`** en todos los componentes
- **Lazy loading** de rutas con `loadComponent`
- **Control flow:** `@if`, `@for`, `@switch` (no `*ngIf`/`*ngFor`)
- **Path aliases:** `@core/`, `@shared/`, `@features/`, `@models/`

### Styling

- **Mobile-first:** breakpoints 320px → sm → md → lg → xl
- **Tailwind CSS** para layout y utilidades
- **SCSS** + CSS custom properties para theming
- **Dark mode** via clase `.dark` (toggle manual + respeta preferencia del sistema)
- **`prefers-reduced-motion`** respetado en todas las animaciones

---

## Scripts Disponibles

### Root

| Script    | Descripción                  |
| --------- | ---------------------------- |
| `prepare` | Configura Husky hooks        |

### Frontend (`frontend/portfolio-spa/`)

| Script           | Descripción                                |
| ---------------- | ------------------------------------------ |
| `start`          | Dev server con HMR (`ng serve`)            |
| `build`          | Build de producción                        |
| `test`           | Ejecutar tests (Vitest)                    |
| `lint`           | ESLint check                               |
| `format`         | Prettier write                             |
| `format:check`   | Prettier check                             |
| `serve:ssr:*`    | Servir build SSR                           |

### Backend (`backend/`)

| Script  | Descripción              |
| ------- | ------------------------ |
| `build` | Compilar TypeScript      |
| `test`  | Ejecutar tests (Vitest)  |
| `lint`  | ESLint check             |

---

## Licencia

MIT © Juan Enrique Morales Castro
