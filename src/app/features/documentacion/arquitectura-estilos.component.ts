import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página de documentación del sistema de estilos. Pensada para desarrolladores
 * que no dominan CSS/SCSS: explica carpetas, tokens, @layer, PrimeNG vs Tailwind
 * y cómo hacer cambios comunes.
 *
 * Los snippets de código viven como strings aquí (no en la plantilla) porque en
 * los templates de Angular los caracteres @, { } y {{ }} tienen significado
 * especial y romperían el parser. Se renderizan con interpolación segura.
 */
@Component({
  selector: 'app-arquitectura-estilos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arquitectura-estilos.component.html',
  styleUrl: './arquitectura-estilos.component.scss',
})
export class ArquitecturaEstilosComponent {
  /** Snippets de código mostrados en la página. */
  protected readonly code = {
    layersDecl: `@layer reset, base, primeng, sp-theme, layout, components, utilities;`,

    layerExample: `/* Aunque este selector es MÁS específico... */
@layer primeng {
  .p-button.p-button-lg { background: gray; }
}

/* ...este GANA solo por estar en una capa posterior. */
@layer sp-theme {
  :root { --p-button-primary-background: blue; }
}`,

    colorToken: `:root {
  --app-primary-500: #3b82f6;   /* azul base de la marca */
  --app-primary-600: #2563eb;
  --app-text-primary: #0f172a;  /* color de texto principal */
}`,

    spThemeLink: `@layer sp-theme {
  :root {
    /* Conectamos la variable de PrimeNG con NUESTRO token. */
    --p-primary-500: var(--app-primary-500);
    --p-inputtext-border-color: var(--app-surface-300);
  }
}`,

    tailwindTheme: `@theme inline {
  /* Tailwind genera "bg-neutral-500", "text-success", etc.
     apuntando a nuestros tokens. */
  --color-neutral-500: var(--app-neutral-500);
  --color-success: var(--app-success);
  --spacing-4: var(--app-space-4);
}`,

    configSnippet: `providePrimeNG({
  theme: {
    preset: AppPreset,              // Lara + nuestra paleta
    options: {
      darkModeSelector: false,      // SOLO modo claro
      cssLayer: {
        name: 'primeng',            // PrimeNG escribe en @layer primeng
        order: 'reset, base, primeng, sp-theme, layout, components, utilities'
      }
    }
  },
  ripple: true
})`,

    changeColor: `/* src/styles/tokens/_colors.scss */
:root {
  --app-primary-500: #16a34a;   /* antes #3b82f6 → ahora verde */
  --app-primary-600: #15803d;
}`,

    usageTailwind: `<!-- Tailwind para LAYOUT y espaciado -->
<div class="flex items-center justify-between gap-4 p-6">
  <h2 class="text-heading-lg">Título</h2>
  <button class="...">Acción</button>
</div>`,

    usagePattern: `<!-- Patrón propio para una tarjeta -->
<article class="card">
  <h3 class="text-heading-sm">Paciente</h3>
  <p class="text-body-sm">Contenido…</p>
</article>

<!-- Patrón de campo de formulario -->
<div class="field">
  <label class="field__label">Ciudad</label>
  <p-select ... />
</div>`,

    usagePrime: `<!-- PrimeNG para el control complejo; su color
     ya viene de nuestros tokens (sp-theme). -->
<p-select [options]="ciudades" placeholder="Selecciona" />
<p-button label="Guardar" icon="pi pi-save" />`,

    badTailwindOnPrime: `<!-- ❌ MAL: forzar el color interno de PrimeNG con Tailwind -->
<p-button class="bg-red-500" label="Guardar" />

<!-- ✅ BIEN: cambiarlo con un token en _primeng-theme.scss -->
--p-button-primary-background: var(--app-primary-600);`,
  };
}
