import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { merge } from 'rxjs';

import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';

import { FormFieldComponent } from '../../../../../shared/ui/molecules/form-field/form-field.component';
import { DatosPacienteManual } from '../../../../../domain/no-hospitalario/solicitud/entities/datos-paciente-manual.entity';
import { SolicitudCrearStore } from '../../solicitud-crear.store';

/**
 * Sección: datos del paciente + (en cobertura) plan ya vive en cobertura.
 *
 * Tiene DOS modos según el store:
 *  - CON cobertura: muestra los datos del paciente en SOLO LECTURA.
 *  - SIN cobertura (`store.sinCobertura()`): un FORMULARIO REACTIVO con todos los
 *    campos obligatorios. El formulario es la superficie de edición/validación;
 *    su valor se sincroniza al store (`actualizarDatosManuales`), que sigue
 *    siendo la fuente de verdad para el resumen y el guardado. El botón global
 *    «Guardar» se habilita vía `store.puedeGuardar()`.
 *
 * La sección se RECREA en cada nueva consulta (la página la oculta mientras
 * `coberturaResuelta` es false), así el formulario nace limpio sin resets.
 */
@Component({
  selector: 'app-seccion-paciente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    Select,
    InputText,
    DatePicker,
    FormFieldComponent,
  ],
  templateUrl: './seccion-paciente.component.html',
  styleUrl: './seccion-paciente.component.scss',
})
export class SeccionPacienteComponent {
  protected readonly store = inject(SolicitudCrearStore);
  private readonly fb = inject(FormBuilder);

  /** Opciones del sexo (sin placeholder: el FloatLabel hace de etiqueta). */
  protected readonly sexoOptions = [
    { label: 'Femenino', value: 'F' },
    { label: 'Masculino', value: 'M' },
  ];

  /** Tope del datepicker: no se puede nacer en el futuro. */
  protected readonly hoy = new Date();

  protected readonly form = this.fb.group({
    nombre: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    apellido: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    fechaNacimiento: this.fb.control<Date | null>(null, [Validators.required]),
    edad: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    sexo: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    ocupacion: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    celular: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    telefono: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    email: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  /** Tick reactivo del formulario para recomputar errores bajo OnPush. */
  private readonly estado = toSignal(
    merge(
      this.form.events,
      ...Object.values(this.form.controls).map((c) => c.events),
    ),
  );

  constructor() {
    // El formulario es la superficie de edición; el store, la fuente de verdad.
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((valor) =>
        this.store.actualizarDatosManuales(valor as Partial<DatosPacienteManual>),
      );
  }

  /** Mensaje de error del campo (solo tras tocarlo), o `null` si es válido. */
  protected mensajeError(nombre: string): string | null {
    this.estado(); // dependencia para recomputar bajo OnPush
    const control = this.form.get(nombre);
    if (!control || control.valid || !control.touched) return null;
    if (control.errors?.['email']) return 'Correo electrónico inválido.';
    return 'Este campo es obligatorio.';
  }

  /** ¿Mostrar el campo en estado inválido (borde rojo)? */
  protected esInvalido = (nombre: string): boolean => this.mensajeError(nombre) !== null;

  protected marcarTocado(nombre: string): void {
    this.form.get(nombre)?.markAsTouched();
  }
}
