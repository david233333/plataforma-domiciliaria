import { PacienteCobertura } from '../../../domain/no-hospitalario/solicitud/entities/paciente-cobertura.entity';
import { PacienteCoberturaDto } from './paciente-cobertura.dto';
import { toTipoIdentificacion } from '../../maestros/tipo-identificacion.mapper';
import { toPlanSalud } from '../../maestros/plan-salud.mapper';
import { toConvenio } from '../../maestros/convenio.mapper';
import { toTiposPlanParticular } from '../../maestros/tipos-plan-particular.mapper';

/** Cadena segura: el backend puede enviar `null` en casi cualquier texto. */
const str = (valor: string | null): string => valor ?? '';

/** Fecha ISO → `Date`, o `null` si el backend no la envía (o viene vacía). */
const fecha = (valor: string | null): Date | null =>
  valor ? new Date(valor) : null;

/**
 * DTO → Entidad de dominio. Reusa los mappers de cada maestro para los objetos
 * anidados (tipoIdentificacion, tipoAfiliacion, convenios, tipoPlanParticular) y
 * convierte las fechas ISO (`string`) a `Date`. Centralizar la traducción aquí
 * mantiene al dominio aislado del contrato del backend.
 *
 * El backend responde `null` con frecuencia, así que el mapper es DEFENSIVO:
 * - objetos anidados ausentes → `null` (no se invoca su mapper)
 * - `convenios` ausente → `[]`
 * - textos ausentes → `''`; booleanos ausentes → `false`
 * - fechas ausentes/vacías → `null`
 */
export function toPacienteCobertura(
  dto: PacienteCoberturaDto,
): PacienteCobertura {
  return {
    idRemisionPK: str(dto.idRemisionPK),
    tipoIdentificacion: dto.tipoIdentificacion
      ? toTipoIdentificacion(dto.tipoIdentificacion)
      : null,
    numeroIdentificacion: str(dto.numeroIdentificacion),
    nombre: str(dto.nombre),
    apellido: str(dto.apellido),
    fechaNacimiento: fecha(dto.fechaNacimiento),
    edad: str(dto.edad),
    unidadEdad: str(dto.unidadEdad),
    sexo: str(dto.sexo),
    estadoCivil: str(dto.estadoCivil),
    ocupacion: str(dto.ocupacion),
    email: str(dto.email),
    tipoAsegurador: str(dto.tipoAsegurador),
    estadoSuspension: str(dto.estadoSuspension),
    coberturaDomiciliaria: dto.coberturaDomiciliaria ?? false,
    fechaLimiteCobertura: fecha(dto.fechaLimiteCobertura),
    tipoAfiliacion: dto.tipoAfiliacion ? toPlanSalud(dto.tipoAfiliacion) : null,
    convenios: dto.convenios?.map(toConvenio) ?? [],
    nivelIngreso: str(dto.nivelIngreso),
    ipsBasicaAsignada: str(dto.ipsBasicaAsignada),
    lugarAtencion: str(dto.lugarAtencion),
    codigoARL: str(dto.codigoARL),
    peso: str(dto.peso),
    medidaDepeso: str(dto.medidaDepeso),
    tipoPlanParticular: dto.tipoPlanParticular
      ? toTiposPlanParticular(dto.tipoPlanParticular)
      : null,
    nombrePersonaAutoriza: str(dto.nombrePersonaAutoriza),
    codigoSiniestro: str(dto.codigoSiniestro),
    priorizacion: str(dto.priorizacion),
    esEditable: dto.esEditable ?? false,
    fechaInicioSintomas: str(dto.fechaInicioSintomas),
    fechaConsultaMedica: str(dto.fechaConsultaMedica),
    fechaTomaMuestra: str(dto.fechaTomaMuestra),
    tipoCasoCovid: str(dto.tipoCasoCovid),
    encounterId: str(dto.encounterId),
    resultadoAyudasDiagnosticas: str(dto.resultadoAyudasDiagnosticas),
    integracion: str(dto.integracion),
    observacion: str(dto.observacion),
    embarazada: str(dto.embarazada),
    oxigenoDependiente: str(dto.oxigenoDependiente),
    pacienteSinFechaNacimiento: str(dto.pacienteSinFechaNacimiento),
    medicoCreadorTipo: str(dto.medicoCreadorTipo),
    medicoCreadorNumero: str(dto.medicoCreadorNumero),
    codigoSexo: str(dto.codigoSexo),
    descSexo: str(dto.descSexo),
    codigoPlan: str(dto.codigoPlan),
    descPlan: str(dto.descPlan),
    descMunicipio: str(dto.descMunicipio),
    codigoDaneMunicipio: str(dto.codigoDaneMunicipio),
    descDepartamento: str(dto.descDepartamento),
    codigoDaneDpto: str(dto.codigoDaneDpto),
    PAC: dto.PAC ?? false,
    subNivel: dto.subNivel ?? null,
    vacunacion: str(dto.vacunacion),
    celular: str(dto.celular),
    telefono: str(dto.telefono),
    tienePoliza: dto.tienePoliza ?? false,
    tienePac: dto.tienePac ?? false,
    tienePOS: dto.tienePOS ?? false,
    tieneArl: dto.tieneArl ?? false,
  };
}
