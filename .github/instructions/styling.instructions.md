---
applyTo: "frontend/**/*.{scss,html}"
---
# Styling Instructions

## Tailwind CSS
- Mobile-first: diseñar para 320px, luego `sm:`, `md:`, `lg:`, `xl:`
- Usar clases de Tailwind para layout, spacing, typography
- Usar `@apply` en SCSS solo para componentes muy repetidos
- Dark mode: usar clase `dark:` (class-based, no media query)

## SCSS
- Variables de tema en `_themes.scss` como CSS custom properties
- Usar `_variables.scss` para breakpoints y z-index scale
- BEM naming para clases custom: `block__element--modifier`
- No anidar más de 3 niveles

## Accesibilidad
- Contraste mínimo 4.5:1 (AA) para texto normal
- Contraste mínimo 3:1 para texto grande y elementos UI
- Focus visible en TODOS los elementos interactivos
- No depender solo del color para transmitir información
- `prefers-reduced-motion: reduce` → desactivar animaciones

## Responsive
- Breakpoints: 320px (mobile), 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Imágenes: usar `srcset` + `sizes` para responsive images
- Touch targets: mínimo 44x44px en mobile
