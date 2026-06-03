import {
  EstadoNovedad,
  ESTADOS_NOVEDAD,
} from '../../domain/novedades/entities/estado-novedad';
import { Novedad } from '../../domain/novedades/entities/novedad.entity';
import { NovedadDto } from './novedad.dto';

/** Estado por defecto si el backend enviara un valor desconocido. */
const ESTADO_FALLBACK: EstadoNovedad = 'PENDIENTE_GESTION';

function aEstadoNovedad(valor: string): EstadoNovedad {
  return (ESTADOS_NOVEDAD as readonly string[]).includes(valor)
    ? (valor as EstadoNovedad)
    : ESTADO_FALLBACK;
}

/** DTO → Entidad de dominio (parsea fechas ISO a `Date`). */
export function toNovedad(dto: NovedadDto): Novedad {
  return {
    id: dto.id,
    tipoNovedad: dto.tipoNovedad,
    especialidad: dto.especialidad,
    nombrePaciente: dto.nombrePaciente,
    numeroIdentificacion: dto.numeroIdentificacion,
    piso: dto.piso,
    usuarioReporta: dto.usuarioReporta,
    usuarioGestion: dto.usuarioGestion,
    fechaSolicitud: new Date(dto.fechaSolicitud),
    fechaGestion: dto.fechaGestion ? new Date(dto.fechaGestion) : null,
    estado: aEstadoNovedad(dto.estado),
  };
}

/** Entidad de dominio → DTO (serializa fechas a ISO). */
export function toNovedadDto(novedad: Novedad): NovedadDto {
  return {
    id: novedad.id,
    tipoNovedad: novedad.tipoNovedad,
    especialidad: novedad.especialidad,
    nombrePaciente: novedad.nombrePaciente,
    numeroIdentificacion: novedad.numeroIdentificacion,
    piso: novedad.piso,
    usuarioReporta: novedad.usuarioReporta,
    usuarioGestion: novedad.usuarioGestion,
    fechaSolicitud: novedad.fechaSolicitud.toISOString(),
    fechaGestion: novedad.fechaGestion ? novedad.fechaGestion.toISOString() : null,
    estado: novedad.estado,
  };
}
