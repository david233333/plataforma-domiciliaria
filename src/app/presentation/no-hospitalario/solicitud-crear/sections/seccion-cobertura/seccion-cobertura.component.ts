import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { merge } from 'rxjs';

import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';

import { FormFieldComponent } from '../../../../../shared/ui/molecules/form-field/form-field.component';
import { FormActionsComponent } from '../../../../../shared/ui/molecules/form-actions/form-actions.component';
import { ButtonComponent } from '../../../../../shared/ui/atoms/button/button.component';

import { MaestrosUseCase } from '../../../../../domain/maestros/use-cases/maestros.use-case';
import { TipoIdentificacion } from '../../../../../domain/maestros/entities/tipo-identificacion.entity';
import { SolicitudCrearStore } from '../../solicitud-crear.store';

/**
 * Sección: identificación y cobertura. Es la PRIMERA del flujo; al consultar
 * dispara `store.cargarCobertura()` y, al resolverse, el resto de secciones se
 * desbloquean (la página las muestra según `store.coberturaResuelta()`).
 *
 * Inyecta el store directamente (componente de FEATURE, no del sistema de
 * diseño). El catálogo de tipos de identificación es un CATÁLOGO de UI: vive
 * local aquí (vía `MaestrosUseCase`), no en el store. El formulario es reactivo;
 * el store es la fuente de verdad del resultado, no de estos dos campos.
 */
@Component({
  selector: 'app-seccion-cobertura',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Select,
    InputText,
    FormFieldComponent,
    FormActionsComponent,
    ButtonComponent,
  ],
  templateUrl: './seccion-cobertura.component.html',
  styleUrl: './seccion-cobertura.component.scss',
})
export class SeccionCoberturaComponent {
  protected readonly store = inject(SolicitudCrearStore);
  private readonly fb = inject(FormBuilder);
  private readonly maestros = inject(MaestrosUseCase);

  /** Catálogo del dropdown (UI), no estado de negocio → vive local. */
  protected readonly tiposIdentificacion = signal<TipoIdentificacion[]>([]);
  protected readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    tipoIdentificacion: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    numeroIdentificacion: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /** Tick reactivo del formulario para recomputar errores bajo OnPush. */
  private readonly estado = toSignal(
    merge(
      this.form.events,
      ...Object.values(this.form.controls).map((c) => c.events),
    ),
  );

  protected readonly mostrarErrorTipo = computed(() =>
    this.campoInvalido('tipoIdentificacion'),
  );
  protected readonly mostrarErrorNumero = computed(() =>
    this.campoInvalido('numeroIdentificacion'),
  );

  constructor() {
    this.maestros.consultarTiposIdentificacion().subscribe({
      next: (tipos) => this.tiposIdentificacion.set(tipos),
      error: () => this.tiposIdentificacion.set([]),
    });
  }

  protected buscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitted.set(true);
      return;
    }
    const { tipoIdentificacion, numeroIdentificacion } = this.form.getRawValue();
    this.store.cargarCobertura({
      tipoId: tipoIdentificacion,
      numeroId: numeroIdentificacion,
    });
  }

  protected marcarTocado(nombre: string): void {
    this.form.get(nombre)?.markAsTouched();
  }

  private campoInvalido(nombre: string): boolean {
    this.estado(); // dependencia para recomputar bajo OnPush
    const control = this.form.get(nombre);
    return (
      !!control && control.invalid && (control.touched || this.submitted())
    );
  }
}
