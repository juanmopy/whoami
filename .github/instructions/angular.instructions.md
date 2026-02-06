---
applyTo: "frontend/**/*.ts"
---
# Angular Component Instructions

- Usar standalone components (NO NgModules)
- Usar signals: `signal()`, `computed()`, `effect()` para estado reactivo
- Usar `inject()` en lugar de constructor injection
- Implementar `ChangeDetectionStrategy.OnPush` en TODOS los componentes
- Lazy load routes con `loadComponent` en `app.routes.ts`
- Reactive Forms obligatorio (no Template-Driven Forms)
- Tipar todo — prohibido `any`
- Cleanup de subscriptions con `takeUntilDestroyed()`
- Path aliases: `@core/`, `@shared/`, `@features/`, `@models/`
- Cada componente debe tener su `.spec.ts` correspondiente
- Usar `@if`, `@for`, `@switch` (nuevo control flow syntax de Angular 17+)
- NO usar `*ngIf`, `*ngFor`, `*ngSwitch` (deprecated)
