import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

import { routes } from './app.routes';

// =============================================================================
// PRESET PRIMENG — basado en Lara (estética enterprise: bordes rectos, densidad
// profesional). definePreset recibe VALORES HEX DIRECTOS (no var() ni CSS custom
// properties: esa sintaxis no existe en PrimeNG). Establece los valores base.
//
// El VÍNCULO real con nuestros tokens --app-* ocurre EXCLUSIVAMENTE en
// styles/themes/_primeng-theme.scss (@layer sp-theme), donde --p-* = var(--app-*).
// Por eso aquí los hex solo necesitan COINCIDIR con la rampa primary para que el
// estado inicial (antes de que cargue el SCSS) ya sea correcto.
// =============================================================================
const AppPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // NOTA: no registramos provideAnimations(). En Angular 21 las transiciones
    // de ruta usan la directiva nativa `animate.enter` (core), que no requiere
    // provider. Ver app/core/animations/animations.ts.
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          // SOLO light mode: nunca activar dark.
          darkModeSelector: false,
          // PrimeNG inyecta sus estilos dentro de @layer primeng. El `order`
          // DEBE ser idéntico al @layer declarado en styles/abstracts/_layers.scss,
          // o PrimeNG quedaría fuera de capa y rompería la cascada.
          cssLayer: {
            name: 'primeng',
            order: 'reset, base, primeng, sp-theme, layout, components, utilities',
          },
        },
      },
      ripple: true,
    }),
  ],
};
