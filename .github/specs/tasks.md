# ✅ Tasks — Portfolio SPA Implementation

> Cada tarea sigue el formato: contexto → acción → verificación
> Estimación en story points (1=trivial, 2=simple, 3=medio, 5=complejo, 8=muy complejo)

---

## Fase 0 — Scaffolding & Configuración Base

### T0.1 — Inicializar Monorepo (SP: 3)
**Contexto**: Necesitamos estructura de monorepo con npm workspaces.
**Acción**:
1. `mkdir portfolio && cd portfolio`
2. `npm init -w frontend -w backend -w infra`
3. Crear `.nvmrc` con `22`
4. Crear `.npmrc`:
   ```
   engine-strict=true
   audit=true
   fund=false
   save-exact=true
   ```
5. Crear `.editorconfig`, `.gitattributes`, `CODEOWNERS`
6. `git init && git commit --allow-empty -m "chore: initial commit"`

**Verificación**:
- [ ] `npm install` funciona desde raíz
- [ ] `.nvmrc` apunta a Node 22
- [ ] `.npmrc` tiene `audit=true` y `save-exact=true`

### T0.2 — Scaffold Angular App (SP: 3)
**Contexto**: Frontend Angular 19+ con standalone components.
**Acción**:
1. `cd frontend && ng new portfolio-spa --style=scss --routing --ssr --standalone`
2. Instalar dependencias:
   ```bash
   ng add @angular/material
   npm i -E tailwindcss @tailwindcss/postcss postcss
   npm i -E -D @angular-eslint/schematics prettier eslint-config-prettier
   ```
3. Configurar `tailwind.config.js` con content paths
4. Configurar ESLint + Prettier
5. Crear estructura de carpetas: `core/`, `shared/`, `features/`, `models/`

**Verificación**:
- [ ] `ng serve` levanta sin errores
- [ ] Tailwind classes funcionan
- [ ] ESLint + Prettier configurados
- [ ] Estructura de carpetas creada

### T0.3 — Configurar Husky + Commitlint (SP: 2)
**Contexto**: Enforcing conventional commits y pre-commit hooks.
**Acción**:
1. `npm i -E -D husky lint-staged @commitlint/cli @commitlint/config-conventional`
2. `npx husky init`
3. Crear `.husky/pre-commit` → `npx lint-staged`
4. Crear `.husky/commit-msg` → `npx commitlint --edit $1`
5. Configurar `lint-staged` en `package.json`:
   ```json
   { "*.ts": ["eslint --fix", "prettier --write"], "*.html": ["prettier --write"] }
   ```
6. Crear `commitlint.config.js`

**Verificación**:
- [ ] Commit con formato incorrecto es rechazado
- [ ] Pre-commit ejecuta lint y format

---

## Fase 1 — Core & Shared Components

### T1.1 — Theme Service + Toggle (SP: 3)
**Contexto**: R5.4 — Soporte dark/light mode.
**Acción**:
1. Crear `core/services/theme.service.ts` usando signals:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class ThemeService {
     private theme = signal<'light' | 'dark'>(this.getInitialTheme());
     currentTheme = this.theme.asReadonly();
     toggle() { ... } // Actualiza signal + localStorage + document.body class
   }
   ```
2. Crear `shared/components/theme-toggle/` con icono sol/luna animado
3. Definir CSS custom properties en `_themes.scss`
4. Respetar `prefers-color-scheme` del sistema

**Verificación**:
- [ ] Toggle cambia tema visualmente
- [ ] Persiste en localStorage
- [ ] Respeta preferencia del sistema al primer load

### T1.2 — Navbar Component (SP: 3)
**Contexto**: Navegación principal responsive.
**Acción**:
1. Crear `shared/components/navbar/navbar.component.ts` (standalone)
2. Links: Inicio, Sobre Mí, Portafolio, Contacto, Agendar
3. Mobile: hamburger menu con animación
4. Scroll spy: highlight sección activa
5. Incluir theme toggle
6. Sticky con backdrop-blur en scroll

**Verificación**:
- [ ] Responsive en mobile/tablet/desktop
- [ ] Scroll spy funciona correctamente
- [ ] Accesible con teclado (Tab navigation)
- [ ] ARIA labels correctos

### T1.3 — Footer Component (SP: 2)
**Contexto**: Footer con links sociales y copyright.
**Acción**:
1. Crear `shared/components/footer/footer.component.ts`
2. Links sociales con iconos (GitHub, LinkedIn, Twitter/X, Email)
3. Copyright dinámico con año actual
4. Link "Back to top" con smooth scroll

**Verificación**:
- [ ] Links sociales abren en nueva pestaña con `rel="noopener noreferrer"`
- [ ] Año se actualiza automáticamente

### T1.4 — SEO Service (SP: 2)
**Contexto**: R5.5 — SEO optimizado para GitHub Pages.
**Acción**:
1. Crear `core/services/seo.service.ts`
2. Actualizar `<title>`, meta description, og:tags por ruta
3. Generar `sitemap.xml` en build time
4. Crear `robots.txt`
5. Structured data (JSON-LD) para Person schema

**Verificación**:
- [ ] Cada ruta tiene title y meta únicos
- [ ] Open Graph tags presentes
- [ ] JSON-LD válido en validator de Google

---

## Fase 2 — Feature Components

### T2.1 — Hero Section (SP: 3)
**Contexto**: R1.1 — Primera impresión del portfolio.
**Acción**:
1. Crear `features/hero/hero.component.ts`
2. Layout: foto (optimizada WebP + lazy) + nombre + título + tagline animada (typed effect)
3. CTA buttons: "Ver Proyectos" + "Contactar"
4. Particles o gradient animado de fondo (CSS only, no libs pesadas)
5. Scroll indicator animado

**Verificación**:
- [ ] LCP < 2.5s (imagen hero optimizada)
- [ ] Animaciones respetan `prefers-reduced-motion`
- [ ] CTA visible above the fold en mobile

### T2.2 — About Section + Skills + Timeline (SP: 5)
**Contexto**: R1.2, R1.3, R1.4 — Información personal y profesional.
**Acción**:
1. Crear `features/about/about.component.ts`
2. Sub-componentes:
   - `skills/skill-bar.component.ts` — barras animadas por categoría
   - `timeline/timeline.component.ts` — experiencia con scroll animation
3. Datos desde `assets/data/skills.json` y `assets/data/experience.json`
4. Animate on scroll con `IntersectionObserver` directive

**Verificación**:
- [ ] Skills se animan al entrar en viewport
- [ ] Timeline es responsive (vertical mobile, horizontal desktop)
- [ ] Datos cargados correctamente desde JSON

### T2.3 — Portfolio Grid + Detail (SP: 5)
**Contexto**: R2.1, R2.2, R2.3 — Showcase de proyectos.
**Acción**:
1. Crear `features/portfolio/portfolio.component.ts`
2. Sub-componentes:
   - `project-card/` — card con imagen, título, tags, hover effect
   - `project-filter/` — chips de tecnología para filtrar
   - `project-detail/` — modal o ruta con vista completa
3. Datos desde `assets/data/projects.json`
4. Filtrado reactivo con signals:
   ```typescript
   selectedTags = signal<string[]>([]);
   filteredProjects = computed(() =>
     this.projects().filter(p =>
       this.selectedTags().length === 0 ||
       p.tags.some(t => this.selectedTags().includes(t))
     )
   );
   ```
5. Lazy load de imágenes con `loading="lazy"` + placeholder blur

**Verificación**:
- [ ] Grid responsive (1 col mobile, 2 tablet, 3 desktop)
- [ ] Filtro funciona correctamente
- [ ] Imágenes con lazy loading
- [ ] Transición suave al abrir detalle

### T2.4 — Contact Form (SP: 5)
**Contexto**: R3.1-R3.5 — Formulario de contacto seguro.
**Acción**:
1. Crear `features/contact/contact-form/contact-form.component.ts`
2. Reactive form con validaciones:
   ```typescript
   form = new FormGroup({
     name: new FormControl('', [Validators.required, Validators.minLength(2)]),
     email: new FormControl('', [Validators.required, Validators.email]),
     subject: new FormControl('', [Validators.required]),
     message: new FormControl('', [Validators.required, Validators.minLength(10)]),
     honeypot: new FormControl(''),  // Hidden anti-spam field
   });
   ```
3. Crear `core/services/contact.service.ts` → POST a backend serverless
4. Estados: idle → sending → success → error (con signal)
5. Sanitizar inputs con DomSanitizer
6. Rate limiting client-side (max 3 envíos por minuto)

**Verificación**:
- [ ] Validación inline funciona
- [ ] Honeypot field está hidden (CSS, no `display:none`)
- [ ] Envío exitoso muestra toast de confirmación
- [ ] Rate limiting previene spam
- [ ] XSS sanitizado

### T2.5 — Booking / Calendar Section (SP: 3)
**Contexto**: R4.1-R4.4 — Reserva de agenda.
**Acción**:
1. Crear `features/booking/booking.component.ts`
2. Crear `features/booking/calendar-embed/calendar-embed.component.ts`
3. Integrar Cal.com embed:
   ```typescript
   // Lazy load del script de Cal.com
   @Component({
     template: `
       <div id="cal-embed" data-cal-link="tu-usuario/30min"></div>
     `
   })
   ```
4. Fallback: link directo a Cal.com si embed falla
5. Tipos de reunión: "Intro 30min", "Consultoría 60min"

**Verificación**:
- [ ] Embed carga correctamente
- [ ] Fallback funciona si Cal.com no carga
- [ ] CSP permite iframe de Cal.com
- [ ] Mobile responsive

### T2.6 — Social Links Component (SP: 1)
**Contexto**: R3.3 — Links a redes sociales.
**Acción**:
1. Crear `features/contact/social-links/social-links.component.ts`
2. Iconos SVG inline (no font icons) para GitHub, LinkedIn, Twitter/X, Email
3. Hover animations
4. `target="_blank"` + `rel="noopener noreferrer"`

**Verificación**:
- [ ] Todos los links funcionan
- [ ] Iconos visibles en ambos temas
- [ ] `rel="noopener noreferrer"` presente

---

## Fase 3 — Backend Serverless

### T3.1 — Contact Form Cloud Function (SP: 5)
**Contexto**: R3.2 — Procesamiento del formulario de contacto.
**Acción**:
1. Crear `backend/functions/contact/index.ts`:
   ```typescript
   export async function handleContact(req, res) {
     // 1. Validate with zod schema
     // 2. Check honeypot
     // 3. Rate limit by IP
     // 4. Sanitize inputs
     // 5. Send email via Resend/SendGrid
     // 6. Return success/error
   }
   ```
2. Crear `backend/shared/cors.ts` — whitelist solo tu dominio
3. Crear `backend/shared/rate-limiter.ts`
4. Crear `backend/shared/sanitizer.ts`
5. Configurar variables de entorno (API keys)

**Verificación**:
- [ ] CORS solo permite tu dominio
- [ ] Rate limiting funciona (429 después de límite)
- [ ] Email se recibe correctamente
- [ ] Inputs sanitizados (no HTML/scripts)
- [ ] Honeypot rechaza bots

### T3.2 — GitHub Repos Proxy (Opcional) (SP: 3)
**Contexto**: R2.4 — Datos dinámicos de GitHub.
**Acción**:
1. Crear `backend/functions/github-repos/index.ts`
2. Usar `@octokit/rest` para fetch repos
3. Cache en memoria (5 min TTL) para evitar rate limits
4. Filtrar solo repos públicos + pinned
5. Mapear a `Project` model

**Verificación**:
- [ ] Responde con repos formateados
- [ ] Cache funciona (segunda llamada < 50ms)
- [ ] Maneja errores de GitHub API gracefully

---

## Fase 4 — Infraestructura & SCA

### T4.1 — GitHub Actions CI Pipeline (SP: 5)
**Contexto**: R6.2, R6.4 — Pipeline seguro.
**Acción**:
1. Crear `infra/.github/workflows/ci.yml`:
   ```yaml
   name: CI
   on: [push, pull_request]
   permissions:
     contents: read
   jobs:
     audit:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@<SHA>      # Pinned!
         - uses: actions/setup-node@<SHA>
           with:
             node-version-file: '.nvmrc'
             cache: 'npm'
         - run: npm ci                        # Uses lockfile
         - run: npm audit --audit-level=high  # Fail on high/critical
     lint:
       # ESLint + Prettier check
     test:
       # ng test --no-watch --code-coverage
       # Coverage gate: 80%
     build:
       # ng build --configuration=production
       # Lighthouse CI check
   ```
2. Todas las Actions pinneadas por SHA (no tags)

**Verificación**:
- [ ] Pipeline falla con vulnerabilidades high/critical
- [ ] Tests corren y coverage ≥ 80%
- [ ] Build produce output optimizado
- [ ] Todas las Actions usan SHA, no tags

### T4.2 — GitHub Actions CD Pipeline (SP: 3)
**Contexto**: Deploy automático a GitHub Pages.
**Acción**:
1. Crear `infra/.github/workflows/cd.yml`:
   ```yaml
   name: Deploy
   on:
     push:
       branches: [main]
   permissions:
     pages: write
     id-token: write
   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - # Checkout, setup, build
         - uses: actions/upload-pages-artifact@<SHA>
           with:
             path: frontend/dist/portfolio-spa/browser
         - uses: actions/deploy-pages@<SHA>
   ```
2. Configurar custom domain (opcional)
3. Crear `404.html` con redirect script para SPA routing

**Verificación**:
- [ ] Deploy automático en push a main
- [ ] SPA routing funciona (deep links)
- [ ] HTTPS habilitado
- [ ] Custom domain configurado (si aplica)

### T4.3 — CodeQL + Dependency Review (SP: 3)
**Contexto**: R6.4 — SAST y revisión de dependencias.
**Acción**:
1. Crear `infra/.github/workflows/codeql.yml`:
   ```yaml
   name: CodeQL
   on:
     push:
       branches: [main]
     pull_request:
     schedule:
       - cron: '0 6 * * 1'  # Weekly
   jobs:
     analyze:
       permissions:
         security-events: write
       steps:
         - uses: github/codeql-action/init@<SHA>
           with:
             languages: javascript-typescript
         - uses: github/codeql-action/analyze@<SHA>
   ```
2. Crear `infra/.github/workflows/dependency-review.yml`
3. Configurar `infra/.github/dependabot.yml`:
   ```yaml
   version: 2
   updates:
     - package-ecosystem: npm
       directory: /frontend
       schedule:
         interval: weekly
       open-pull-requests-limit: 10
       reviewers: ["tu-usuario"]
     - package-ecosystem: npm
       directory: /backend
       schedule:
         interval: weekly
     - package-ecosystem: github-actions
       directory: /infra/.github/workflows
       schedule:
         interval: weekly
   ```

**Verificación**:
- [ ] CodeQL detecta vulnerabilidades en PRs
- [ ] Dependency review bloquea deps con vulnerabilidades conocidas
- [ ] Dependabot crea PRs de actualización

### T4.4 — SBOM Generation (SP: 2)
**Contexto**: R6.7 — Software Bill of Materials.
**Acción**:
1. `npm i -E -D @cyclonedx/cyclonedx-npm`
2. Crear `infra/.github/workflows/sbom.yml`:
   ```yaml
   name: SBOM
   on:
     release:
       types: [published]
   jobs:
     sbom:
       steps:
         - run: npx @cyclonedx/cyclonedx-npm --output-file sbom.json
         - # Upload as release asset
   ```

**Verificación**:
- [ ] SBOM se genera en formato CycloneDX
- [ ] Se adjunta como asset en cada release

### T4.5 — Copilot Instructions (SP: 2)
**Contexto**: Configurar Copilot para el proyecto.
**Acción**:
1. Crear `infra/.github/copilot-instructions.md` (adaptar del `instructions.md` general)
2. Crear `infra/.github/instructions/angular.instructions.md`:
   ```markdown
   ---
   applyTo: "frontend/**/*.ts"
   ---
   - Usar standalone components (no NgModules)
   - Usar signals para estado reactivo
   - Usar inject() en lugar de constructor injection
   - Implementar OnPush change detection
   - Lazy load routes con loadComponent
   ```
3. Crear `infra/.github/instructions/security.instructions.md`
4. Crear `infra/AGENTS.md`

**Verificación**:
- [ ] Copilot respeta instrucciones al generar código
- [ ] Path-specific instructions aplican correctamente

---

## Fase 5 — Polish & Optimization

### T5.1 — Animations & Micro-interactions (SP: 3)
**Acción**:
1. Crear `shared/directives/animate-on-scroll.directive.ts` con IntersectionObserver
2. Route transitions con `@angular/animations`
3. Hover effects en cards y buttons
4. Loading skeletons para contenido async
5. Respetar `prefers-reduced-motion`

### T5.2 — PWA Configuration (SP: 2)
**Acción**:
1. `ng add @angular/pwa`
2. Configurar `ngsw-config.json` con caching strategies
3. Manifest con iconos y colores del tema
4. Offline fallback page

### T5.3 — Performance Optimization (SP: 3)
**Acción**:
1. Configurar `@angular/ssr` prerendering para todas las rutas
2. Image optimization: WebP + srcset + sizes
3. Font loading: `font-display: swap` + preload
4. Bundle analysis: `ng build --stats-json` + webpack-bundle-analyzer
5. Tree shaking verification

### T5.4 — Lighthouse CI Gate (SP: 2)
**Acción**:
1. Agregar Lighthouse CI al pipeline:
   ```yaml
   - uses: treosh/lighthouse-ci-action@<SHA>
     with:
       urls: |
         https://tu-usuario.github.io/portfolio/
       budgetPath: ./lighthouse-budget.json
   ```
2. Budget: Performance ≥ 90, A11y ≥ 90, Best Practices ≥ 90, SEO ≥ 90

### T5.5 — i18n Setup (SP: 3) [P2 - Opcional]
**Acción**:
1. Configurar `@angular/localize` o `ngx-translate`
2. Crear archivos `assets/i18n/en.json` y `assets/i18n/es.json`
3. Language switcher en navbar
4. Detectar idioma del navegador

---

## Resumen de Estimación

| Fase | Story Points | Descripción |
|------|-------------|-------------|
| Fase 0 | 8 | Scaffolding & Config |
| Fase 1 | 10 | Core & Shared |
| Fase 2 | 22 | Features |
| Fase 3 | 8 | Backend |
| Fase 4 | 15 | Infra & SCA |
| Fase 5 | 13 | Polish |
| **Total** | **76 SP** | ~3-4 sprints (2 semanas c/u) |

## Orden de Ejecución Recomendado

```
T0.1 → T0.2 → T0.3 (base)
  ↓
T1.1 → T1.2 → T1.3 → T1.4 (core)
  ↓
T2.1 → T2.2 → T2.3 → T2.4 → T2.5 → T2.6 (features, parallelizable)
  ↓
T3.1 → T3.2 (backend, parallelizable con Fase 2)
  ↓
T4.1 → T4.2 → T4.3 → T4.4 → T4.5 (infra, iniciar desde Fase 0)
  ↓
T5.1 → T5.2 → T5.3 → T5.4 → T5.5 (polish)
```
