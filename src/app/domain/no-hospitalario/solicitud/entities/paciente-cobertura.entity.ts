import { TipoIdentificacion } from '../../../maestros/entities/tipo-identificacion.entity';
import { PlanSalud } from '../../../maestros/entities/plan-salud.entity';
import { Convenio } from '../../../maestros/entities/convenio.entity';
import { TiposPlanParticular } from '../../../maestros/entities/tipos-plan-particular.entity';

/**
 * Entidad de dominio: paciente con su cobertura. Es la respuesta del controlador
 * «información paciente» del backend (`GET api_ingreso/paciente/{tipo}/{numero}`),
 * que alimenta el botón «Consultar cobertura» del formulario de solicitudes.
 *
 * Inmutable. TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP. Varias
 * propiedades son ENTIDADES de maestros (`TipoIdentificacion`, `PlanSalud`,
 * `Convenio`, `TiposPlanParticular`): el mapper de infraestructura reusa los
 * mappers de cada maestro para construirlas. Las fechas se exponen como `Date`
 * (el backend las envía como texto ISO; el mapper convierte).
 *
 * NULOS: el backend puede responder vacío en muchos campos. Los objetos anidados,
 * las fechas y `subNivel` se exponen como `| null` (el `null` es significativo y
 * la UI debe contemplarlo). Los `string`/`boolean`/`convenios` los normaliza el
 * mapper (`'' `, `false`, `[]`) para no propagar `null` por toda la presentación.
 */
export interface PacienteCobertura {
  readonly idRemisionPK: string;
  readonly tipoIdentificacion: TipoIdentificacion | null;
  readonly numeroIdentificacion: string;
  readonly nombre: string;
  readonly apellido: string;
  readonly fechaNacimiento: Date | null;
  readonly edad: string;
  readonly unidadEdad: string;
  readonly sexo: string;
  readonly estadoCivil: string;
  readonly ocupacion: string;
  readonly email: string;
  readonly tipoAsegurador: string;
  readonly estadoSuspension: string;
  readonly coberturaDomiciliaria: boolean;
  readonly fechaLimiteCobertura: Date | null;
  readonly tipoAfiliacion: PlanSalud | null;
  readonly convenios: readonly Convenio[];
  readonly nivelIngreso: string;
  readonly ipsBasicaAsignada: string;
  readonly lugarAtencion: string;
  readonly codigoARL: string;
  readonly peso: string;
  readonly medidaDepeso: string;
  readonly tipoPlanParticular: TiposPlanParticular | null;
  readonly nombrePersonaAutoriza: string;
  readonly codigoSiniestro: string;
  readonly priorizacion: string;
  readonly esEditable: boolean;
  readonly fechaInicioSintomas: string;
  readonly fechaConsultaMedica: string;
  readonly fechaTomaMuestra: string;
  readonly tipoCasoCovid: string;
  readonly encounterId: string;
  readonly resultadoAyudasDiagnosticas: string;
  readonly integracion: string;
  readonly observacion: string;
  readonly embarazada: string;
  readonly oxigenoDependiente: string;
  readonly pacienteSinFechaNacimiento: string;
  readonly medicoCreadorTipo: string;
  readonly medicoCreadorNumero: string;
  readonly codigoSexo: string;
  readonly descSexo: string;
  readonly codigoPlan: string;
  readonly descPlan: string;
  readonly descMunicipio: string;
  readonly codigoDaneMunicipio: string;
  readonly descDepartamento: string;
  readonly codigoDaneDpto: string;
  readonly PAC: boolean;
  readonly subNivel: number | null;
  readonly vacunacion: string;
  readonly celular: string;
  readonly telefono: string;
  readonly tienePoliza: boolean;
  readonly tienePac: boolean;
  readonly tienePOS: boolean;
  readonly tieneArl: boolean;
}
