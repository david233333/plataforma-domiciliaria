/**
 * Datos del paciente ingresados a MANO cuando no tiene cobertura.
 *
 * Cuando «información paciente» responde 500 ([[paciente-sin-cobertura.error]]),
 * el flujo no recibe la entidad `PacienteCobertura` del backend; el usuario los
 * captura. Es un modelo MÍNIMO (solo lo que la sección de paciente deja editar),
 * no el espejo completo de `PacienteCobertura`. `fechaNacimiento` viaja como
 * `Date` (lo que produce el `p-datepicker`).
 */
export interface DatosPacienteManual {
  readonly nombre: string;
  readonly apellido: string;
  readonly fechaNacimiento: Date | null;
  readonly edad: string;
  readonly sexo: string; // 'F' | 'M' | ''
  readonly ocupacion: string;
  readonly celular: string;
  readonly telefono: string;
  readonly email: string;
}

/** Estado inicial: todos los campos vacíos. */
export const DATOS_PACIENTE_MANUAL_VACIO: DatosPacienteManual = {
  nombre: '',
  apellido: '',
  fechaNacimiento: null,
  edad: '',
  sexo: '',
  ocupacion: '',
  celular: '',
  telefono: '',
  email: '',
};
