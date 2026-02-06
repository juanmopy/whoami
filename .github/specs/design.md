# 🏗️ System Design — Portfolio SPA

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                           │
│  GitHub Pages (CDN) ← GitHub Actions (CI/CD)                │
│  Dependabot + CodeQL + npm audit + SBOM                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     FRONTEND (SPA)                           │
│  Angular 19+ │ Standalone Components │ Signals │ SSR/Prerender│
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────────┐ │
│  │  Hero   │ │Portfolio │ │Contact  │ │ Booking          │ │
│  │  About  │ │  Grid    │ │  Form   │ │ (Cal.com embed)  │ │
│  │Timeline │ │  Detail  │ │  Social │ │ Google Calendar  │ │
│  └─────────┘ └──────────┘ └─────────┘ └──────────────────┘ │
│  Angular Material/CDK │ Tailwind CSS │ @angular/animations  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     BACKEND (Serverless)                     │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ Contact Form   │  │ GitHub API     │  │ Calendar API  │ │
│  │ (Cloud Func /  │  │ (repos data)   │  │ (availability)│ │
│  │  Formspree)    │  │                │  │               │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│  Google Cloud Functions / Netlify Functions / Formspree     │
└─────────────────────────────────────────────────────────────┘
```

## 2. Estructura del Monorepo

```
portfolio/
├── frontend/                          # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                  # Servicios singleton, guards, interceptors
│   │   │   │   ├── services/
│   │   │   │   │   ├── theme.service.ts
│   │   │   │   │   ├── seo.service.ts
│   │   │   │   │   ├── analytics.service.ts
│   │   │   │   │   └── contact.service.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── csp.interceptor.ts
│   │   │   │   │   └── error.interceptor.ts
│   │   │   │   └── guards/
│   │   │   ├── shared/                # Componentes reutilizables
│   │   │   │   ├── components/
│   │   │   │   │   ├── navbar/
│   │   │   │   │   ├── footer/
│   │   │   │   │   ├── theme-toggle/
│   │   │   │   │   ├── scroll-to-top/
│   │   │   │   │   └── loading-skeleton/
│   │   │   │   ├── directives/
│   │   │   │   │   ├── lazy-load.directive.ts
│   │   │   │   │   └── animate-on-scroll.directive.ts
│   │   │   │   └── pipes/
│   │   │   │       └── safe-html.pipe.ts
│   │   │   ├── features/              # Feature modules (lazy-loaded)
│   │   │   │   ├── hero/
│   │   │   │   │   ├── hero.component.ts
│   │   │   │   │   ├── hero.component.html
│   │   │   │   │   └── hero.component.spec.ts
│   │   │   │   ├── about/
│   │   │   │   │   ├── about.component.ts
│   │   │   │   │   ├── about.component.html
│   │   │   │   │   ├── timeline/
│   │   │   │   │   └── skills/
│   │   │   │   ├── portfolio/
│   │   │   │   │   ├── portfolio.component.ts
│   │   │   │   │   ├── project-card/
│   │   │   │   │   ├── project-detail/
│   │   │   │   │   └── project-filter/
│   │   │   │   ├── contact/
│   │   │   │   │   ├── contact-form/
│   │   │   │   │   ├── social-links/
│   │   │   │   │   └── contact.component.ts
│   │   │   │   └── booking/
│   │   │   │       ├── booking.component.ts
│   │   │   │       └── calendar-embed/
│   │   │   ├── models/
│   │   │   │   ├── project.model.ts
│   │   │   │   ├── skill.model.ts
│   │   │   │   └── contact.model.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── assets/
│   │   │   ├── data/                  # JSON estáticos
│   │   │   │   ├── projects.json
│   │   │   │   ├── skills.json
│   │   │   │   └── experience.json
│   │   │   ├── images/
│   │   │   │   └── projects/
│   │   │   └── i18n/
│   │   │       ├── en.json
│   │   │       └── es.json
│   │   ├── environments/
│   │   ├── styles/
│   │   │   ├── _variables.scss
│   │   │   ├── _themes.scss
│   │   │   ├── _animations.scss
│   │   │   └── styles.scss
│   │   └── index.html
│   ├── angular.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   ├── ngsw-config.json              # Service Worker (PWA)
│   └── package.json
│
├── backend/                           # Serverless Functions
│   ├── functions/
│   │   ├── contact/
│   │   │   ├── index.ts               # Contact form handler
│   │   │   ├── validator.ts
│   │   │   └── contact.spec.ts
│   │   └── github-repos/
│   │       ├── index.ts               # GitHub API proxy (cache)
│   │       └── github-repos.spec.ts
│   ├── shared/
│   │   ├── cors.ts
│   │   ├── rate-limiter.ts
│   │   └── sanitizer.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── serverless.yml                 # o firebase.json
│
├── infra/                             # Infraestructura como Código
│   ├── .github/
│   │   ├── workflows/
│   │   │   ├── ci.yml                 # Lint + Test + Build + Audit
│   │   │   ├── cd.yml                 # Deploy to GitHub Pages
│   │   │   ├── codeql.yml            # SAST Analysis
│   │   │   ├── dependency-review.yml  # PR dependency check
│   │   │   └── sbom.yml              # Generate SBOM
│   │   ├── dependabot.yml
│   │   ├── copilot-instructions.md
│   │   └── instructions/
│   │       ├── angular.instructions.md
│   │       ├── security.instructions.md
│   │       └── testing.instructions.md
│   ├── AGENTS.md
│   ├── scripts/
│   │   ├── pre-commit.sh
│   │   ├── generate-sri.js
│   │   └── check-licenses.js
│   └── docs/
│       ├── ADR/                       # Architecture Decision Records
│       │   ├── 001-angular-over-react.md
│       │   ├── 002-github-pages-hosting.md
│       │   └── 003-serverless-backend.md
│       └── SECURITY.md
│
├── .nvmrc                             # Node version pinning
├── .npmrc                             # Registry config + audit settings
├── .editorconfig
├── .gitattributes
├── .gitignore
├── CODEOWNERS
├── LICENSE
├── README.md
└── package.json                       # Workspace root (npm workspaces)
```

## 3. Tech Stack Detallado

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Angular | 19.x | Framework SPA (signals, standalone, SSR) |
| Angular Material / CDK | 19.x | UI components + a11y primitives |
| Tailwind CSS | 4.x | Utility-first styling |
| @angular/animations | 19.x | Transiciones y micro-interacciones |
| @angular/service-worker | 19.x | PWA + offline support |
| @angular/ssr | 19.x | Prerendering para GitHub Pages |
| ngx-markdown | latest | Renderizar contenido markdown |
| @ngneat/until-destroy | latest | Gestión de subscriptions |

### Backend (Serverless)
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Node.js | 22 LTS | Runtime |
| Google Cloud Functions / Formspree | - | Contact form processing |
| @octokit/rest | latest | GitHub API client |
| zod | latest | Runtime validation |
| helmet | latest | Security headers |
| express-rate-limit | latest | Rate limiting |

### Infraestructura & SCA
| Tecnología | Propósito |
|-----------|-----------|
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Hosting estático (CDN) |
| Dependabot | Auto-update dependencies |
| CodeQL | SAST analysis |
| npm audit | Vulnerability scanning |
| @cyclonedx/cyclonedx-npm | SBOM generation |
| Socket.dev | Malicious package detection |
| Lighthouse CI | Performance/A11y gates |
| Husky + lint-staged | Pre-commit hooks |
| Commitlint | Conventional commits |
| ESLint + Prettier | Code quality |

### Booking / Calendar
| Opción | Pros | Contras |
|--------|------|---------|
| **Cal.com (embed)** ✅ | Open source, personalizable, Google Calendar sync | Requiere cuenta Cal.com |
| Google Appointment Scheduling | Nativo Google | Requiere Google Workspace |
| Calendly (embed) | Popular, fácil | Freemium limitado |

**Decisión**: Cal.com como opción primaria (open source, embed ligero, sync con Google Calendar).

## 4. Flujo de Datos

```
[Usuario] → [Angular SPA en GitHub Pages]
                │
                ├─→ /about, /portfolio → Lee JSON estáticos (assets/data/)
                │
                ├─→ /portfolio (dynamic) → GitHub API (via backend proxy con cache)
                │
                ├─→ /contact → POST → Cloud Function → Email (SendGrid/Resend)
                │                                    → Respuesta al usuario
                │
                └─→ /booking → Cal.com embed (iframe) → Google Calendar
```

## 5. Estrategia de Routing (SPA en GitHub Pages)

```typescript
// GitHub Pages no soporta server-side routing
// Solución: 404.html redirect hack + HashLocationStrategy como fallback

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // Para GitHub Pages: usar PathLocationStrategy + 404.html trick
    // O HashLocationStrategy como fallback seguro
  ]
};
```

**404.html trick**: Script en 404.html que redirige a index.html preservando la ruta.

## 6. Estrategia de Seguridad

### Content Security Policy (meta tag en index.html)
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
    script-src 'self' 'unsafe-inline' https://cal.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.github.com https://*.cloudfunctions.net;
    frame-src https://cal.com;">
```

### SCA Pipeline
```
PR Created → dependency-review-action → npm audit → CodeQL scan
           → Socket.dev check → License compliance → ✅ Merge allowed
```

## 7. Estrategia de Prerendering (SEO en GitHub Pages)

```json
// angular.json
{
  "prerender": {
    "routesFile": "routes.txt"  // /about, /portfolio, /contact, /booking
  }
}
```

Genera HTML estático para cada ruta → GitHub Pages sirve HTML → Angular hydrata.

## 8. Modelo de Datos

```typescript
// project.model.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  screenshots?: string[];
  tags: string[];          // ['Angular', 'Node.js', 'Firebase']
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  date: string;            // ISO date
}

// skill.model.ts
export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'soft';
  level: number;           // 1-100
  icon: string;            // Material icon or SVG path
}

// experience.model.ts
export interface Experience {
  company: string;
  role: string;
  period: { start: string; end?: string };
  description: string;
  technologies: string[];
}

// contact.model.ts
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;       // Anti-spam
}
```
