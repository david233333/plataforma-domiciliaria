# shared

UI tonta (wrappers presentacionales de PrimeNG en `ui/`), `pipes/`, `directives/`
y `utils/` **sin negocio**. No depende de ninguna capa interna (`domain`,
`application`, `infrastructure`, `presentation`, `core`); solo de sí misma.

Si algo necesita una regla de negocio, NO va aquí: va a `domain`.
