import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { catchError, filter, map, pipe, switchMap, tap, throwError } from 'rxjs';

import { SolicitudUseCase } from '../../../domain/no-hospitalario/solicitud/use-cases/solicitud.use-case';
import { PacienteCobertura } from '../../../domain/no-hospitalario/solicitud/entities/paciente-cobertura.entity';
import { PlanSalud } from '../../../domain/no-hospitalario/solicitud/entities/plan-salud.entity';
import { TipoServicio } from '../../../domain/no-hospitalario/solicitud/entities/tipo-servicio.entity';
import { InferenciaServicio } from '../../../domain/no-hospitalario/solicitud/entities/inferencia-servicio.entity';
import { ResultadoSolicitud } from '../../../domain/no-hospitalario/solicitud/entities/solicitud.entity';
import {
  DatosPacienteManual,
  DATOS_PACIENTE_MANUAL_VACIO,
} from '../../../domain/no-hospitalario/solicitud/entities/datos-paciente-manual.entity';
import { PacienteSinCoberturaError } from '../../../domain/no-hospitalario/solicitud/errors/paciente-sin-cobertura.error';

/**
 * ============================================================================
 * SolicitudCrearStore — estado de la pantalla «crear solicitud» con @ngrx/signals
 * ============================================================================
 *
 * QUÉ ES: un SignalStore. Por dentro es un servicio Angular (se inyecta con
 * `inject(SolicitudCrearStore)`), pero se CONSTRUYE componiendo "features":
 * `withState` (el estado), `withComputed` (lo derivado), `withMethods` (las
 * acciones). Vive en la CAPA DE PRESENTACIÓN porque usa Angular DI; el dominio
 * (use-case) sigue siendo TS puro y este store lo CONSUME, no lo reemplaza.
 *
 * DÓNDE SE PROVEE: en los `providers` del componente página (no en `root`), así
 * NACE Y MUERE con la pantalla. Cada vez que entras a «Nueva solicitud»
 * empiezas limpio, sin resets manuales.
 *
 * ÚNICA FUENTE DE VERDAD: aquí viven las SELECCIONES e INFERENCIAS del flujo.
 * Las secciones de la UI leen/escriben este store (cero `@Input`/`@Output`
 * entre ellas). Los catálogos de dropdowns NO van aquí (son del componente).
 */

/** Forma del estado. Cada campo se vuelve un signal: `store.paciente()`, etc. */
type SolicitudCrearState = {
  // Cobertura / identificación
  identificacion: { tipoId: string; numeroId: string } | null;
  paciente: PacienteCobertura | null;
  // El backend respondió «sin cobertura» (500): se captura el paciente a mano.
  sinCobertura: boolean;
  datosManuales: DatosPacienteManual;
  planesSalud: PlanSalud[];
  planSalud: string | null;
  // Servicio
  tiposServicio: TipoServicio[];
  tipoServicio: string | null;
  inferencia: InferenciaServicio | null;
  // Resultado del guardado
  resultado: ResultadoSolicitud | null;
  // Banderas de carga (una por operación async, para spinners independientes)
  cargandoCobertura: boolean;
  infiriendo: boolean;
  guardando: boolean;
};

const initialState: SolicitudCrearState = {
  identificacion: null,
  paciente: null,
  sinCobertura: false,
  datosManuales: DATOS_PACIENTE_MANUAL_VACIO,
  planesSalud: [],
  planSalud: null,
  tiposServicio: [],
  tipoServicio: null,
  inferencia: null,
  resultado: null,
  cargandoCobertura: false,
  infiriendo: false,
  guardando: false,
};

export const SolicitudCrearStore = signalStore(
  // 1) ESTADO. `withState` convierte cada propiedad en un signal de solo lectura.
  withState(initialState),

  // 2) DERIVADOS. Como `computed()`: se recalculan solos al cambiar sus fuentes.
  //    Aquí viven las banderas que DESBLOQUEAN las secciones progresivas y el
  //    resumen — la UI no decide nada, solo refleja estos cálculos.
  withComputed((store) => ({
    // Resuelta tanto si hubo cobertura (paciente del backend) como si no la hay
    // y se entró en modo manual: en ambos casos se revelan las demás secciones.
    coberturaResuelta: computed(
      () => store.paciente() !== null || store.sinCobertura(),
    ),
    servicioHabilitado: computed(() => store.planSalud() !== null),
    puedeGuardar: computed(() => {
      const base = store.inferencia() !== null && !store.guardando();
      if (!base) return false;
      // Sin cobertura, todos los datos manuales son obligatorios para guardar.
      if (!store.sinCobertura()) return true;
      const d = store.datosManuales();
      return (
        d.fechaNacimiento !== null &&
        [
          d.nombre,
          d.apellido,
          d.edad,
          d.sexo,
          d.ocupacion,
          d.celular,
          d.telefono,
          d.email,
        ].every((v) => v.trim() !== '')
      );
    }),
    nombrePaciente: computed(() => {
      const p = store.paciente();
      if (p) return `${p.nombre} ${p.apellido}`;
      if (store.sinCobertura()) {
        const d = store.datosManuales();
        return `${d.nombre} ${d.apellido}`.trim() || '—';
      }
      return '—';
    }),
    nombrePlan: computed(
      () =>
        store.planesSalud().find((p) => p.id === store.planSalud())?.nombre ??
        '—',
    ),
    nombreServicio: computed(
      () =>
        store
          .tiposServicio()
          .find((s) => s.codigo === store.tipoServicio())?.nombre ?? '—',
    ),
  })),

  // 3) ACCIONES. Cambios SÍNCRONOS con `patchState`; cadenas ASYNC con `rxMethod`.
  //    El use-case de dominio se inyecta una sola vez aquí.
  withMethods((store, useCase = inject(SolicitudUseCase)) => ({
    /**
     * Carga inicial de catálogos del flujo. `rxMethod<void>`: lo llamas como
     * `store.cargarCatalogos()` y él gestiona la suscripción (se autolimpia).
     */
    cargarCatalogos: rxMethod<void>(
      pipe(
        switchMap(() =>
          useCase.consultarTiposServicio().pipe(
            tapResponse({
              next: (tiposServicio) => patchState(store, { tiposServicio }),
              error: () => patchState(store, { tiposServicio: [] }),
            }),
          ),
        ),
      ),
    ),

    /**
     * Consulta cobertura del paciente y, encadenado, sus planes disponibles.
     * Reemplaza el `subscribe`+`takeUntilDestroyed` del legacy. El `switchMap`
     * CANCELA una consulta anterior si llega otra (anti datos fantasma).
     *
     * Si el backend responde «sin cobertura» (el adaptador lo traduce a
     * `PacienteSinCoberturaError`), el `catchError` NO lo trata como fallo:
     * cambia a modo MANUAL (`sinCobertura: true`, sin paciente) y ofrece solo el
     * plan «Particular». Cualquier otro error se re-propaga y `tapResponse` solo
     * apaga el spinner. (El toast genérico de 500 lo sigue mostrando el
     * `errorInterceptor`.)
     */
    cargarCobertura: rxMethod<{ tipoId: string; numeroId: string }>(
      pipe(
        tap(({ tipoId, numeroId }) =>
          patchState(store, {
            identificacion: { tipoId, numeroId },
            cargandoCobertura: true,
            sinCobertura: false,
            paciente: null,
            datosManuales: DATOS_PACIENTE_MANUAL_VACIO,
            planSalud: null,
            tipoServicio: null,
            inferencia: null,
            resultado: null,
          }),
        ),
        switchMap(({ tipoId, numeroId }) =>
          useCase.consultarCobertura(tipoId, numeroId).pipe(
            switchMap((paciente) =>
              useCase
                .consultarPlanesDisponibles(paciente)
                .pipe(map((planesSalud) => ({ paciente, planesSalud, sinCobertura: false }))),
            ),
            catchError((error) =>
              error instanceof PacienteSinCoberturaError
                ? useCase.consultarPlanesSinCobertura().pipe(
                    map((planesSalud) => ({
                      paciente: null,
                      planesSalud,
                      sinCobertura: true,
                    })),
                  )
                : throwError(() => error),
            ),
            tapResponse({
              next: ({ paciente, planesSalud, sinCobertura }) =>
                patchState(store, {
                  paciente,
                  planesSalud,
                  sinCobertura,
                  cargandoCobertura: false,
                }),
              error: () => patchState(store, { cargandoCobertura: false }),
            }),
          ),
        ),
      ),
    ),

    /** Actualiza un campo de los datos manuales (modo «sin cobertura»). */
    actualizarDatosManuales(parcial: Partial<DatosPacienteManual>): void {
      patchState(store, (s) => ({
        datosManuales: { ...s.datosManuales, ...parcial },
      }));
    },

    /** Selección síncrona del plan: limpia lo que depende de él. */
    seleccionarPlan(planSalud: string | null): void {
      patchState(store, { planSalud, tipoServicio: null, inferencia: null });
    },

    /**
     * Elegir servicio dispara la INFERENCIA (la cascada del legacy, ahora una
     * operación de dominio). El `filter` evita inferir sin plan elegido.
     */
    seleccionarServicio: rxMethod<string | null>(
      pipe(
        tap((tipoServicio) =>
          patchState(store, { tipoServicio, inferencia: null }),
        ),
        filter(
          (tipoServicio): tipoServicio is string =>
            tipoServicio !== null && store.planSalud() !== null,
        ),
        tap(() => patchState(store, { infiriendo: true })),
        switchMap((tipoServicio) =>
          useCase.inferirServicio(store.planSalud()!, tipoServicio).pipe(
            tapResponse({
              next: (inferencia) =>
                patchState(store, { inferencia, infiriendo: false }),
              error: () => patchState(store, { infiriendo: false }),
            }),
          ),
        ),
      ),
    ),

    /** Guarda la solicitud ensamblando el comando desde el estado actual. */
    guardar: rxMethod<void>(
      pipe(
        filter(() => store.inferencia() !== null),
        tap(() => patchState(store, { guardando: true })),
        switchMap(() => {
          const inferencia = store.inferencia()!;
          const identificacion = store.identificacion();
          return useCase
            .guardar({
              tipoIdentificacion: identificacion?.tipoId ?? '',
              numeroIdentificacion: identificacion?.numeroId ?? '',
              planSalud: store.planSalud()!,
              tipoServicio: store.tipoServicio()!,
              programa: inferencia.programa,
              piso: inferencia.piso,
              zona: inferencia.zona,
              conducta: inferencia.conducta,
              sla: inferencia.sla,
              copago: inferencia.copago,
              // Sin cobertura: adjunta los datos capturados a mano.
              datosPaciente: store.sinCobertura() ? store.datosManuales() : undefined,
            })
            .pipe(
              tapResponse({
                next: (resultado) =>
                  patchState(store, { resultado, guardando: false }),
                error: () => patchState(store, { guardando: false }),
              }),
            );
        }),
      ),
    ),

    /** Vuelve al estado inicial (botón «Reiniciar» / nueva solicitud). */
    reiniciar(): void {
      patchState(store, initialState);
    },
  })),
);
