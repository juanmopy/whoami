# 📋 Requirements — Portfolio SPA (GitHub Pages)

## R1 — Identidad y Marca Personal
| ID | Requisito | Tipo (EARS) | Prioridad |
|----|-----------|-------------|-----------|
| R1.1 | El sistema **mostrará** sección Hero con nombre, título profesional, foto y CTA | Ubiquitous | P0 |
| R1.2 | El sistema **mostrará** sección "Sobre Mí" con bio, skills técnicos y soft skills | Ubiquitous | P0 |
| R1.3 | El sistema **mostrará** timeline de experiencia profesional | Ubiquitous | P1 |
| R1.4 | El sistema **mostrará** certificaciones y educación | Ubiquitous | P1 |
| R1.5 | **Cuando** el usuario descargue el CV, el sistema **generará** un PDF actualizado | Event-Driven | P1 |

## R2 — Portafolio de Proyectos
| ID | Requisito | Tipo (EARS) | Prioridad |
|----|-----------|-------------|-----------|
| R2.1 | El sistema **mostrará** grid/lista de proyectos con imagen, título, descripción y tags | Ubiquitous | P0 |
| R2.2 | **Cuando** el usuario seleccione un proyecto, el sistema **mostrará** vista detallada con screenshots, tech stack, links (demo/repo) y descripción extendida | Event-Driven | P0 |
| R2.3 | **Cuando** el usuario filtre por tecnología, el sistema **mostrará** solo proyectos que coincidan | Event-Driven | P1 |
| R2.4 | El sistema **obtendrá** datos de proyectos desde archivos JSON estáticos o GitHub API | Ubiquitous | P0 |
| R2.5 | **Cuando** el usuario busque un proyecto, el sistema **filtrará** resultados en tiempo real | Event-Driven | P2 |

## R3 — Contacto
| ID | Requisito | Tipo (EARS) | Prioridad |
|----|-----------|-------------|-----------|
| R3.1 | El sistema **mostrará** formulario de contacto (nombre, email, asunto, mensaje) | Ubiquitous | P0 |
| R3.2 | **Cuando** el usuario envíe el formulario, el sistema **enviará** el mensaje vía backend serverless (Formspree/Netlify Functions/Cloud Function) | Event-Driven | P0 |
| R3.3 | El sistema **mostrará** links a redes sociales (GitHub, LinkedIn, Twitter/X) | Ubiquitous | P0 |
| R3.4 | **Cuando** el formulario tenga datos inválidos, el sistema **mostrará** errores de validación inline | Event-Driven | P0 |
| R3.5 | El sistema **implementará** protección anti-spam (honeypot + rate limiting client-side) | Ubiquitous | P1 |

## R4 — Reserva de Agenda (Google Calendar)
| ID | Requisito | Tipo (EARS) | Prioridad |
|----|-----------|-------------|-----------|
| R4.1 | El sistema **mostrará** botón/sección para agendar una reunión | Ubiquitous | P0 |
| R4.2 | **Cuando** el usuario haga clic en "Agendar", el sistema **mostrará** widget embebido de Google Calendar Appointment Scheduling o Cal.com | Event-Driven | P0 |
| R4.3 | **Mientras** no haya slots disponibles, el sistema **mostrará** mensaje informativo | State-Driven | P1 |
| R4.4 | El sistema **permitirá** seleccionar tipo de reunión (30min intro, 60min consultoría) | Ubiquitous | P1 |

## R5 — Requisitos No Funcionales
| ID | Requisito | Tipo (EARS) | Prioridad |
|----|-----------|-------------|-----------|
| R5.1 | El sistema **cargará** en < 3s (LCP) en conexión 3G | Performance | P0 |
| R5.2 | El sistema **puntuará** ≥ 90 en Lighthouse (Performance, A11y, Best Practices, SEO) | Quality | P0 |
| R5.3 | El sistema **será** responsive (mobile-first: 320px → 1920px) | Ubiquitous | P0 |
| R5.4 | El sistema **soportará** tema oscuro/claro con toggle | Ubiquitous | P1 |
| R5.5 | El sistema **implementará** SSR/prerendering para SEO en GitHub Pages | Performance | P0 |
| R5.6 | El sistema **cumplirá** WCAG 2.1 nivel AA | Accessibility | P0 |
| R5.7 | El sistema **implementará** CSP headers y sanitización de inputs | Security | P0 |
| R5.8 | El sistema **usará** Angular 19+ con signals y standalone components | Tech | P0 |
| R5.9 | El sistema **implementará** i18n (ES/EN) | Ubiquitous | P2 |

## R6 — Seguridad de Cadena de Suministro (SCA)
| ID | Requisito | Tipo (EARS) | Prioridad |
|----|-----------|-------------|-----------|
| R6.1 | El proyecto **usará** lockfile (package-lock.json) con integridad SHA-512 | Ubiquitous | P0 |
| R6.2 | El pipeline **ejecutará** `npm audit` en cada build y **fallará** con vulnerabilidades high/critical | Ubiquitous | P0 |
| R6.3 | El proyecto **configurará** Dependabot para actualizaciones automáticas de dependencias | Ubiquitous | P0 |
| R6.4 | El pipeline **ejecutará** análisis SAST con CodeQL en cada PR | Ubiquitous | P0 |
| R6.5 | El proyecto **usará** Subresource Integrity (SRI) para CDN assets externos | Ubiquitous | P1 |
| R6.6 | El proyecto **firmará** commits con GPG/SSH signing | Ubiquitous | P1 |
| R6.7 | El pipeline **generará** SBOM (Software Bill of Materials) en cada release | Ubiquitous | P1 |
| R6.8 | El proyecto **implementará** Socket.dev o Snyk para detección de dependencias maliciosas | Ubiquitous | P1 |
| R6.9 | El proyecto **pinneará** versiones exactas de GitHub Actions (SHA, no tags) | Ubiquitous | P0 |
| R6.10 | El proyecto **configurará** npm provenance para verificar origen de paquetes | Ubiquitous | P2 |
