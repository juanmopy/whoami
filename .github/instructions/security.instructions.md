---
applyTo: "**/*.ts"
---
# Security Instructions

## Input Handling
- SIEMPRE validar inputs del usuario con zod (backend) o Validators (Angular)
- SIEMPRE sanitizar HTML con DomSanitizer antes de renderizar
- NUNCA usar `innerHTML` directamente — usar `[innerHTML]` con pipe de sanitización
- NUNCA usar `eval()`, `Function()`, o `document.write()`

## Dependencies
- Usar versiones exactas (no rangos ^/~)
- Verificar licencia antes de agregar dependencia
- Ejecutar `npm audit` después de agregar dependencia
- Preferir dependencias con pocos sub-dependencies

## API Calls
- SIEMPRE usar HttpClient de Angular (no fetch directo)
- SIEMPRE manejar errores con catchError
- NUNCA exponer API keys en código frontend
- Usar environment files para URLs de API

## Links Externos
- SIEMPRE agregar `rel="noopener noreferrer"` a `target="_blank"`
- SIEMPRE usar HTTPS para recursos externos
- Implementar SRI para scripts/styles de CDN
