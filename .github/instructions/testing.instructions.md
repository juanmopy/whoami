---
applyTo: "**/*.spec.ts"
---
# Testing Instructions

## Estructura
- `describe('NombreComponente/Servicio')` como wrapper principal
- `it('should [comportamiento esperado]')` para cada test
- Agrupar tests relacionados con `describe` anidados

## Mocking
- Usar `jasmine.createSpyObj` para mock de servicios
- Usar `TestBed.configureTestingModule` con providers mockeados
- Para HttpClient: usar `HttpClientTestingModule` + `HttpTestingController`

## Assertions
- Preferir `toBe` para primitivos, `toEqual` para objetos
- Usar `toHaveBeenCalledWith` para verificar llamadas a servicios
- Verificar estados de error, no solo happy path

## Coverage
- Mínimo 80% de coverage por archivo
- Cubrir: creación del componente, inputs/outputs, métodos públicos, edge cases
- NO testear implementación interna — testear comportamiento

## Componentes
- Verificar que el componente se crea
- Verificar bindings de template
- Verificar emisión de eventos (@Output)
- Verificar interacción con servicios
- Verificar estados de loading/error
