// =============================================================================
// ANIMACIONES DE ANGULAR — enfoque moderno (Angular 21)
// =============================================================================
//
// La API de `trigger()`/`transition()` de @angular/animations quedó DEPRECADA
// en 20.2 (remoción prevista en v23), junto con provideAnimations(). El idioma
// actual es la directiva nativa `animate.enter` / `animate.leave` de @angular/core,
// que NO requiere ningún provider.
//
// `routeFadeAnimation` es la clase CSS (definida en styles/utilities/_animations.scss
// → .animate-fade-in, 250ms, respeta prefers-reduced-motion) que se aplica al
// entrar un elemento. La exponemos como const para tener una fuente única del
// nombre y evitar strings mágicos en plantillas.
//
// USO — fade sutil entre cambios de ruta, en el contenedor del router-outlet:
//
//   import { routeFadeAnimation } from './core/animations/animations';
//
//   @Component({
//     template: `
//       <main [animate.enter]="routeFade">
//         <router-outlet />
//       </main>
//     `,
//   })
//   export class App {
//     protected readonly routeFade = routeFadeAnimation;
//   }
//
// Standalone const, sin NgModule, sin API deprecada.
// =============================================================================

/** Clase aplicada vía `[animate.enter]` para un fade de entrada sutil. */
export const routeFadeAnimation = 'animate-fade-in';
