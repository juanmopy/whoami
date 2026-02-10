/**
 * Route transition configuration using CSS View Transitions API.
 *
 * Angular's `withViewTransitions()` in the router config enables
 * the native View Transitions API for route changes.
 *
 * Transition styles are defined in `app.scss` using the `::view-transition`
 * pseudo-elements. This approach:
 * - Is CSS-first (no @angular/animations dependency)
 * - Respects `prefers-reduced-motion`
 * - Works with SSR/prerendering
 * - Has native browser support with graceful fallback
 */
export const VIEW_TRANSITION_DURATION = '200ms';
export const VIEW_TRANSITION_EASING = 'ease-out';
