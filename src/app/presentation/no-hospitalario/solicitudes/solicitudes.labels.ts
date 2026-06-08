/**
 * Etiquetas, catálogos y tipos de UI de la pantalla de Solicitudes.
 *
 * Convención i18n del proyecto (ver core/i18n/README.md): los strings, catálogos
 * y tipos de presentación de la pantalla se co-localizan aquí, no dispersos en el
 * template/componente. Hoy son datos estáticos de ejemplo (esta pantalla es de
 * diseño): cuando exista el slice de dominio `solicitudes`, la entidad y la
 * consulta se moverán a `domain/solicitudes` + su adaptador.
 */

/** Opción genérica para selects de PrimeNG. Tipo de UI (no de dominio). */
export interface Opcion {
  readonly label: string;
  readonly value: string;
}

/** Estado del ciclo de vida de una solicitud (cosmética de presentación). */
export type EstadoSolicitud =
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'FINALIZADA'
  | 'CANCELADA';

/** Prioridad de atención de la solicitud. */
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

/** Fila de la tabla de solicitudes. Tipo de presentación (aún sin dominio). */
export interface Solicitud {
  readonly tipoServicio: string;
  readonly idSolicitud: string;
  readonly fechaFinalizacion: Date | null;
  readonly paciente: string;
  readonly planSalud: string;
  readonly prioridad: Prioridad;
  readonly estado: EstadoSolicitud;
  readonly visita: string;
  readonly usuario: string;
}

/**
 * Datos de ejemplo. La búsqueda (mock) los devuelve para que la tabla, los
 * badges y las acciones se vean funcionando. Al integrar el backend, esto lo
 * reemplaza el caso de uso de dominio.
 */
export const SOLICITUDES_DEMO: Solicitud[] = [
  {
    tipoServicio: 'Enfermería',
    idSolicitud: 'SOL-100245',
    fechaFinalizacion: new Date(2026, 5, 12, 16, 30),
    paciente: 'María Restrepo Gómez',
    planSalud: 'Plan Complementario',
    prioridad: 'ALTA',
    estado: 'PENDIENTE',
    visita: 'Domiciliaria',
    usuario: 'jlopez',
  },
  {
    tipoServicio: 'Fisioterapia',
    idSolicitud: 'SOL-100246',
    fechaFinalizacion: new Date(2026, 5, 13, 9, 0),
    paciente: 'Carlos Andrés Mejía',
    planSalud: 'Medicina Prepagada',
    prioridad: 'MEDIA',
    estado: 'EN_PROCESO',
    visita: 'Telemedicina',
    usuario: 'aramirez',
  },
  {
    tipoServicio: 'Medicina general',
    idSolicitud: 'SOL-100247',
    fechaFinalizacion: new Date(2026, 5, 11, 14, 15),
    paciente: 'Luisa Fernanda Ríos',
    planSalud: 'EPS',
    prioridad: 'BAJA',
    estado: 'FINALIZADA',
    visita: 'Domiciliaria',
    usuario: 'mtorres',
  },
  {
    tipoServicio: 'Terapia respiratoria',
    idSolicitud: 'SOL-100248',
    fechaFinalizacion: null,
    paciente: 'Jorge Eliécer Pérez',
    planSalud: 'Plan Complementario',
    prioridad: 'ALTA',
    estado: 'CANCELADA',
    visita: 'Domiciliaria',
    usuario: 'jlopez',
  },
];
