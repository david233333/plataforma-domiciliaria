import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
 *
 * Aquí también viven los HOSTS de feedback global: un único `<p-toast>` y un
 * único `<p-confirmdialog>`. Al montarse en la raíz, cualquier pantalla solo
 * inyecta `MessageService` / `ConfirmationService` (singletons root, ver
 * app.config) y dispara el aviso o la confirmación sin declarar su propio host.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShellComponent, UsuarioMenuComponent, Toast, ConfirmDialog],
  template: `
    <app-shell>
      <app-usuario-menu header-actions />
    </app-shell>

    <!-- Feedback app-wide: un solo host de toasts y uno de confirmaciones. -->
    <p-toast
      position="top-right"
      [breakpoints]="{ '640px': { width: '100%', right: '0', left: '0' } }"
    />
    <p-confirmdialog />
  `,
})
export class App {}
