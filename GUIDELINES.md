# Guía de uso del Sistema de Diseño

Reglas para que el equipo construya pantallas de forma coherente sobre la
fundación (Angular 21 + PrimeNG 21 + Tailwind v4, **solo light mode**).

> Regla de oro: **una sola fuente de verdad**. Todos los valores nacen de los
> tokens `--app-*` en `src/styles/tokens/`. Nunca se hardcodean.

---

## ⚡ TL;DR — ¿qué herramienta uso?

| Necesito… | Herramienta |
|-----------|-------------|
| Layout, grid, espaciado, responsive, color en HTML propio | **Tailwind** |
| Cambiar look de un componente PrimeNG (color, radio, foco) | **`@layer sp-theme`** (vars `--p-*`) |
| Jerarquía de texto (títulos, body, labels) | **Clases propias** (`.text-heading-*`, …) |
| Patrón repetible (card, field, badge) | **Clases propias SCSS** |
| Keyframes / selectores complejos / lógica `@each` | **SCSS** |

---

## ✅ USA TAILWIND PARA

- **Layout y composición**: `flex`, `grid`, `grid-cols-*`, `gap-*`, `col-span-*`.
- **Espaciado entre elementos**: `p-*`, `m-*`, `gap-*` (mapeados a `--app-space-*`).
- **Color en HTML propio**: `bg-primary-500`, `text-surface-700`, `border-neutral-200`.
- **Responsive**: prefijos `sm:`, `md:`, `lg:`, `xl:`.
- **Estados en HTML propio**: `hover:`, `focus:`, `disabled:`.
- **Posicionamiento utilitario**: `w-*`, `h-*`, `overflow-*`, `relative`, `z-*`.
- **Tipografía utilitaria simple** (ajustes puntuales): `text-sm`, `font-medium`.

## ✅ USA `@layer sp-theme` PARA (`src/styles/themes/_primeng-theme.scss`)

- Cambiar **colores, radios, sombras** dentro de componentes PrimeNG.
- Ajustar **focus ring, padding o tamaño** de componentes PrimeNG.
- Cualquier override que requiera tocar variables `--p-*`.

Gana sobre los estilos de PrimeNG **sin `!important`** porque `sp-theme` está
declarada después de `primeng` en el orden de `@layer`.

## ✅ USA SCSS / PATRONES PARA

- **Patrones reutilizables**: `.card`, `.field`, `.status-badge`, `.empty-state`,
  `.skeleton` (`src/styles/patterns/_patterns.scss`).
- **Jerarquía tipográfica semántica**: `.text-display-*`, `.text-heading-*`,
  `.text-body-*`, `.text-label-*` (`src/styles/typography/_typography.scss`).
- **Keyframes** (`fadeIn`, `shimmer`) y **selectores complejos**: `&::before`,
  `:has()`, `:nth-child()`.
- **Lógica de generación**: `@each`, `@for`, `@mixin` (incl. `respond-to()`).

---

## 🚫 NUNCA

- ❌ Tailwind para sobreescribir internals de PrimeNG → usa `@layer sp-theme`.
- ❌ Hardcodear valores (`#3b82f6`, `16px`) → usa tokens `--app-*`.
- ❌ Crear clases SCSS equivalentes a lo que Tailwind ya cubre.
- ❌ Duplicar lo que provee `tailwindcss-primeui` (`bg-primary-*`, `text-surface-*`).
- ❌ `!important`, salvo dentro de `@layer primeng` como último recurso.
- ❌ Dark mode de cualquier tipo (`darkModeSelector: false`).
- ❌ Animaciones más allá de `fadeIn` y `shimmer`.
- ❌ `@import` de Sass deprecado → usa `@use` / `@forward`.

---

## 🎨 Tokens disponibles (resumen)

| Familia | Token | Ejemplo |
|---------|-------|---------|
| Primary | `--app-primary-50…950` | azul enterprise (`500 = #3b82f6`) |
| Neutral | `--app-neutral-50…950` | grises (texto, bordes) |
| Surface | `--app-surface-0…900` | fondos (`0 = #fff`) |
| Texto | `--app-text-primary / secondary / muted / disabled / on-primary` | |
| Semántico | `--app-{success,warning,error,info}[-light/-dark]` | |
| Tipografía | `--app-font-body/-mono`, `--app-size-xs…7xl`, `--app-weight-*` | |
| Espaciado | `--app-space-1…32` (base 4px) | |
| Radius | `--app-radius-sm/md/lg/xl/full` | |
| Sombra | `--app-shadow-xs…xl`, `--app-shadow-inner` | |
| Motion | `--app-duration-fast/normal/slow`, `--app-ease-out` | |

---

## 🔁 Cómo se propaga un cambio de token

Cambia **un** valor en `src/styles/tokens/_colors.scss`:

```scss
:root { --app-primary-500: #3b82f6; }
```

y se actualiza en **runtime** en los dos sistemas a la vez:

```
_colors.scss  →  :root { --app-primary-500 }
   │
   ├─►  _primeng-theme.scss (@layer sp-theme)
   │       --p-primary-500: var(--app-primary-500)
   │       → todos los componentes PrimeNG
   │
   └─►  tailwind.css (@theme inline, vía tailwindcss-primeui)
           bg-primary-500 { background: var(--app-primary-500) }
           → todas las utilidades Tailwind
```

No hay build manual de paletas ni sincronización: una variable, dos sistemas.

---

## 🧩 Snippets

**Campo de formulario (patrón `.field` + PrimeNG):**
```html
<div class="field">
  <label class="field__label" for="email">
    Email<span class="field__required">*</span>
  </label>
  <input pInputText id="email" formControlName="email" [invalid]="isInvalid('email')" />
  <div class="field__message-slot">
    @if (isInvalid('email')) {
      <span class="field__error">Ingresa un correo válido.</span>
    } @else {
      <span class="field__hint">Lo usaremos para notificarte.</span>
    }
  </div>
</div>
```

**Grid responsivo (Tailwind) con cards (patrón):**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <article class="card">…</article>
</div>
```

**Badge de estado:**
```html
<span class="status-badge status-badge--success">
  <i class="pi pi-check"></i> Activo
</span>
```

---

## 🟢 Catálogo vivo

Ruta `/design-system` (solo fuera de producción). Muestra swatches, escala
tipográfica, espaciado, sombras, cards, badges, fadeIn y un formulario PrimeNG
completo con los 4 estados visuales de un campo.
