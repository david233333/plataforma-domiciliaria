import { TipoIdentificacionDto } from '../../maestros/tipo-identificacion.dto';
import { PlanSaludDto } from '../../maestros/plan-salud.dto';
import { ConvenioDto } from '../../maestros/convenio.dto';
import { TiposPlanParticularDto } from '../../maestros/tipos-plan-particular.dto';

/**
 * DTO de transporte HTTP de la respuesta del controlador «información paciente»
 * (`GET api_ingreso/paciente/{tipo}/{numero}`). Refleja el contrato del backend.
 * Vive en infrastructure: el dominio NUNCA ve este tipo, solo la entidad
 * `PacienteCobertura`.
 *
 * Casi todos los campos son `| null`: el backend responde vacío con frecuencia.
 * El mapper normaliza esos nulos (cadenas → `''`, booleanos → `false`,
 * `convenios` → `[]`) y deja en `null` los objetos anidados, fechas y `subNivel`.
 */
export interface PacienteCoberturaDto {
  readonly idRemisionPK: string | null;
  readonly tipoIdentificacion: TipoIdentificacionDto | null;
  readonly numeroIdentificacion: string | null;
  readonly nombre: string | null;
  readonly apellido: string | null;
  readonly fechaNacimiento: string | null;
  readonly edad: string | null;
  readonly unidadEdad: string | null;
  readonly sexo: string | null;
  readonly estadoCivil: string | null;
  readonly ocupacion: string | null;
  readonly email: string | null;
  readonly tipoAsegurador: string | null;
  readonly estadoSuspension: string | null;
  readonly coberturaDomiciliaria: boolean | null;
  readonly fechaLimiteCobertura: string | null;
  readonly tipoAfiliacion: PlanSaludDto | null;
  readonly convenios: readonly ConvenioDto[] | null;
  readonly nivelIngreso: string | null;
  readonly ipsBasicaAsignada: string | null;
  readonly lugarAtencion: string | null;
  readonly codigoARL: string | null;
  readonly peso: string | null;
  readonly medidaDepeso: string | null;
  readonly tipoPlanParticular: TiposPlanParticularDto | null;
  readonly nombrePersonaAutoriza: string | null;
  readonly codigoSiniestro: string | null;
  readonly priorizacion: string | null;
  readonly esEditable: boolean | null;
  readonly fechaInicioSintomas: string | null;
  readonly fechaConsultaMedica: string | null;
  readonly fechaTomaMuestra: string | null;
  readonly tipoCasoCovid: string | null;
  readonly encounterId: string | null;
  readonly resultadoAyudasDiagnosticas: string | null;
  readonly integracion: string | null;
  readonly observacion: string | null;
  readonly embarazada: string | null;
  readonly oxigenoDependiente: string | null;
  readonly pacienteSinFechaNacimiento: string | null;
  readonly medicoCreadorTipo: string | null;
  readonly medicoCreadorNumero: string | null;
  readonly codigoSexo: string | null;
  readonly descSexo: string | null;
  readonly codigoPlan: string | null;
  readonly descPlan: string | null;
  readonly descMunicipio: string | null;
  readonly codigoDaneMunicipio: string | null;
  readonly descDepartamento: string | null;
  readonly codigoDaneDpto: string | null;
  readonly PAC: boolean | null;
  readonly subNivel: number | null;
  readonly vacunacion: string | null;
  readonly celular: string | null;
  readonly telefono: string | null;
  readonly tienePoliza: boolean | null;
  readonly tienePac: boolean | null;
  readonly tienePOS: boolean | null;
  readonly tieneArl: boolean | null;
}
