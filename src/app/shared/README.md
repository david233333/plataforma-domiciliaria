# shared

UI tonta (wrappers presentacionales de PrimeNG en `ui/`), `pipes/`, `directives/`
y `utils/` **sin negocio**. No depende de ninguna capa interna (`domain`,
`application`, `infrastructure`, `presentation`, `core`); solo de sí misma.

Si algo necesita una regla de negocio, NO va aquí: va a `domain`.

## `ui/` — Atomic Design

Los componentes presentacionales se organizan por **nivel de composición**
(Atomic Design). Todos son **tontos**: reciben `input()`, emiten `output()`, no
inyectan casos de uso ni conocen `domain`. Pueden importar PrimeNG.

```
ui/
├── atoms/        Pieza mínima e indivisible (label, error, badge, ícono).
├── molecules/    Pocos átomos con un propósito (campo = label + control + error).
└── organisms/    Secciones complejas (tarjeta de filtros, header, tabla).
```

Los niveles superiores de Atomic Design viven fuera de `shared`: los **templates**
(shell de la app) en `core/layout`, y las **páginas** (con estado y casos de uso)
en `presentation/<slice>`.

Convención: una carpeta por componente, `nombre.component.ts` con template inline,
`OnPush` y selector con prefijo `app-`. Reutilizan las clases de
`src/styles/patterns/_patterns.scss` y los tokens `--app-*` (no duplican estilos).

### Átomos disponibles (`ui/atoms/`)

| Selector | Para qué sirve | Reusa |
|----------|----------------|-------|
| `app-field-label` | Etiqueta de campo (con asterisco de obligatorio). Soporta `for` (control único) o `groupId` (radiogroup/toggle). | `.field__label`, `.field__required` |
| `app-field-error` | Mensaje de error con `role="alert"`. | `.field__error` |
| `app-field-hint` | Texto de ayuda tenue, con icono opcional. | `.field__hint` |
| `app-icon` | Icono PrimeIcons; gestiona `aria-hidden`/`role="img"` y `spin`. | `pi pi-*` |
| `app-status-badge` | Píldora de estado semántica (`success`/`warning`/`error`/`info`). | `.status-badge--*` |
| `app-skeleton` | Placeholder de carga (`block`/`text`/`circle`). | `.skeleton--*` |
| `app-button` | Botón (envuelve `p-button`) con API propia y desacoplada. | PrimeNG Button |

> Los **controles de formulario** complejos (select, multiselect, datepicker,
> inputtext…) NO se envuelven como átomos: se proyectan dentro de la molécula
> `ui/molecules/form-field` vía `<ng-content>`. El átomo `app-icon` es la pieza
> que las moléculas/organismos componen para sus iconos.

### Moléculas disponibles (`ui/molecules/`)

Cada molécula **compone átomos** y/o proyecta contenido. Son tontas: sin negocio.

| Selector | Para qué sirve | Compone |
|----------|----------------|---------|
| `app-form-field` | Campo: label + control (slot) + error/hint, con altura reservada. | `app-field-label`, `app-field-error`, `app-field-hint` |
| `app-feature-icon` | Icono dentro de un recuadro de color (cabeceras, resúmenes). | `app-icon` |
| `app-page-header` | Encabezado de página: overline + `<h1>` + descripción + icono + slot de acciones. | `app-feature-icon` |
| `app-form-actions` | Barra de botones alineada, con divisor superior opcional. | — (slot de `app-button`) |
| `app-empty-state` | Estado vacío de listas/tablas: icono + título + cuerpo + slot de acción. | `app-icon` |

### Organismos disponibles (`ui/organisms/`)

Secciones reutilizables y **tontas**: aportan el *armazón*; la página (smart)
proyecta el *relleno* variable (filtros, columnas) y le pasa los datos.

| Selector | Para qué sirve | Compone / proyecta |
|----------|----------------|--------------------|
| `app-filter-card` | Panel de filtros colapsable (título + toggle). El estado abierto es `model()` de dos vías. | `app-icon` · proyecta los filtros |
| `app-data-table-card` | Zona de resultados con estados cargando→skeleton / vacío→empty-state / datos→tabla proyectada. | `app-skeleton`, `app-empty-state` · proyecta la tabla |

> **Patrón clave:** los filtros y las columnas **varían por pantalla**, así que se
> resuelven con **proyección** (`<ng-content>`), no con configuración. La página
> mantiene su `FormGroup`, sus casos de uso y sus signals; el organismo solo pone
> la estructura. Ver `presentation/hospitalario/gestionar-novedades` como ejemplo.

> Pendiente: `app-shell`/layout (nivel *template*: cabecera + menú + slot de
> contenido), en `core/layout`.
