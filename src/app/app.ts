import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppShellComponent } from './core/layout/app-shell/app-shell.component';
import { UsuarioMenuComponent } from './presentation/usuario/usuario-menu.component';

/**
 * Punto de entrada raíz. Es deliberadamente delgado: solo monta el TEMPLATE
 * (`app-shell`, en core/layout) y le proyecta las acciones de header propias de
 * la app —hoy, el menú de usuario—.
 *
 * Esta separación respeta la frontera de Clean Architecture: el shell vive en
 * `core` y no puede importar de `presentation`; es `app-root` (capa raíz, que sí
 * puede ver ambas) quien conecta el `usuario-menu` con el slot del shell.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShellComponent, UsuarioMenuComponent],
  template: `
    <app-shell>
      <app-usuario-menu header-actions />
    </app-shell>
  `,
})
export class App {}
