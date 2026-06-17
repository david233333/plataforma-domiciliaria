import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página de documentación sobre la gestión de estado con `@ngrx/signals`
 * (SignalStore): qué es, cómo funciona y cómo está implementado en este proyecto
 * en la pantalla «crear solicitud no hospitalaria». Pensada para aprender desde
 * cero, igual que `NovedadesAngularComponent` y `ArquitecturaEstilosComponent`.
 *
 * Es un componente PURO de documentación: no inyecta servicios, no hace HTTP y
 * no tiene estado vivo. Solo muestra texto explicativo y ejemplos de código.
 *
 * Los snippets viven como strings aquí (no en la plantilla) porque en los
 * templates de Angular los caracteres @, { }, {{ }} y los backticks tienen
 * significado especial y romperían el parser. Se renderizan con interpolación
 * segura: <pre class="doc-code">{{ code.xxx }}</pre>.
 */
@Component({
  selector: 'app-signal-store',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signal-store.component.html',
  styleUrl: './signal-store.component.scss',
})
export class SignalStoreComponent {
  /** Snippets de código mostrados en la página. */
  protected readonly code = {
    // ----- 1. Signals de Angular (punto de partida) -----
    signalsRecap: `const contador = signal(0);     // signal escribible
contador();                     // leer → 0
contador.set(1);                // escribir un valor concreto
contador.update(n => n + 1);    // escribir derivando del anterior

const doble = computed(() => contador() * 2); // signal derivado (solo lectura)`,

    // ----- 2. Anatomía del SignalStore -----
    storeShape: `export const MiStore = signalStore(
  withState(...),     // el ESTADO (datos)
  withComputed(...),  // lo DERIVADO (como computed)
  withMethods(...),   // las ACCIONES (cómo cambia el estado)
  withHooks(...),     // ciclo de vida (onInit / onDestroy) — opcional
);

// El resultado es una CLASE inyectable:
const store = inject(MiStore);`,

    withStateSnippet: `type State = { nombre: string; items: number[]; cargando: boolean };
const initialState: State = { nombre: '', items: [], cargando: false };

withState(initialState)
// → cada campo se vuelve un signal de SOLO LECTURA:
//   store.nombre()   store.items()   store.cargando()`,

    withComputedSnippet: `withComputed((store) => ({
  hayItems: computed(() => store.items().length > 0),
}))
// → store.hayItems()  (se recalcula solo al cambiar items)`,

    withMethodsSnippet: `withMethods((store, api = inject(Api)) => ({
  // los servicios/casos de uso se inyectan en los parámetros por defecto
  setNombre(nombre: string) {
    patchState(store, { nombre });   // cambio SÍNCRONO
  },
}))`,

    // ----- 3. patchState -----
    patchStateSnippet: `patchState(store, { cargando: true });                // objeto parcial
patchState(store, (s) => ({ items: [...s.items, 1] })); // updater (lee el actual)
patchState(store, initialState);                        // reset completo

// Es INMUTABLE: reemplaza solo las claves que pasas y deja el resto igual.
// Es el ÚNICO canal de escritura: hacia afuera el estado es de solo lectura.`,

    // ----- 4. rxMethod -----
    rxMethodSnippet: `buscar: rxMethod<string>(
  pipe(
    tap(() => patchState(store, { cargando: true })),
    switchMap((q) => api.buscar(q).pipe(   // switchMap CANCELA la búsqueda anterior
      tapResponse({
        next: (items) => patchState(store, { items, cargando: false }),
        error: () => patchState(store, { cargando: false }),
      }),
    )),
  ),
)
// uso:  store.buscar('texto')
// rxMethod gestiona la suscripción Y la limpia al destruirse el store.`,

    tapResponseSnippet: `// Regla de oro de rxMethod: si un error SUBE hasta el rxMethod, el método
// "muere" y deja de reaccionar a futuras llamadas. tapResponse captura el
// error DENTRO del stream, así la cadena reactiva sigue viva.
api.guardar(cmd).pipe(
  tapResponse({
    next: (r) => patchState(store, { resultado: r }),
    error: () => patchState(store, { guardando: false }),
  }),
)`,

    // ----- 5. Dónde se provee -----
    provideSnippet: `// A) GLOBAL: singleton para toda la app (estado persistente)
export const ContadorStore = signalStore({ providedIn: 'root' }, /* … */);

// B) POR PANTALLA: ciclo de vida = el del componente (entra limpio, muere al salir)
export const MiStore = signalStore(/* … */);  // sin providedIn

@Component({ providers: [MiStore] })   // ← se registra en el componente/ruta
export class MiPagina { /* inject(MiStore) */ }
// Este proyecto usa la forma B para el estado de un flujo/formulario.`,

    // ----- 6. Implementación en el proyecto: el estado -----
    projState: `type SolicitudCrearState = {
  // Cobertura / identificación
  paciente: PacienteCobertura | null;
  planesSalud: PlanSalud[];
  planSalud: string | null;
  // Servicio
  tiposServicio: TipoServicio[];
  tipoServicio: string | null;
  inferencia: InferenciaServicio | null;
  // Resultado del guardado
  resultado: ResultadoSolicitud | null;
  // Banderas de carga: UNA por operación async → spinners independientes
  cargandoCobertura: boolean;
  infiriendo: boolean;
  guardando: boolean;
};`,

    projComputed: `withComputed((store) => ({
  coberturaResuelta: computed(() => store.paciente() !== null),
  servicioHabilitado: computed(() => store.planSalud() !== null),
  puedeGuardar: computed(() => store.inferencia() !== null && !store.guardando()),
  nombrePaciente: computed(() => { /* … */ }),
  nombrePlan:     computed(() => /* busca el nombre por id */),
  nombreServicio: computed(() => /* busca el nombre por código */),
}))
// La UI NO decide nada: solo refleja estos cálculos (secciones progresivas).`,

    projTemplate: `<!-- seccion-servicio.component.html -->
<p-select
  [ngModel]="store.tipoServicio()"
  (ngModelChange)="store.seleccionarServicio($event)"
  [options]="store.tiposServicio()"
  [disabled]="!store.servicioHabilitado()" />

@if (store.infiriendo()) {
  <app-icon name="spinner" [spin]="true" /> Infiriendo datos del servicio…
}`,

    projMethodsSync: `seleccionarPlan(planSalud: string | null): void {
  // selección que limpia lo que depende de ella
  patchState(store, { planSalud, tipoServicio: null, inferencia: null });
},
reiniciar(): void {
  patchState(store, initialState);   // botón «Reiniciar» / nueva solicitud
},`,

    projMethodsAsync: `cargarCobertura: rxMethod<{ tipoId: string; numeroId: string }>(
  pipe(
    tap(() => patchState(store, { cargandoCobertura: true, paciente: null /* …limpia… */ })),
    switchMap(({ tipoId, numeroId }) =>            // ← cancela una consulta anterior
      useCase.consultarCobertura(tipoId, numeroId).pipe(
        switchMap((paciente) =>                    // encadena: cobertura → planes
          useCase.consultarPlanesDisponibles(paciente).pipe(
            tapResponse({                          // ← error capturado dentro del stream
              next: (planesSalud) =>
                patchState(store, { paciente, planesSalud, cargandoCobertura: false }),
              error: () => patchState(store, { cargandoCobertura: false }),
            }),
          ),
        ),
      ),
    ),
  ),
),`,

    projMethodsFilter: `seleccionarServicio: rxMethod<string | null>(
  pipe(
    tap((tipoServicio) => patchState(store, { tipoServicio, inferencia: null })),
    filter((s): s is string => s !== null && store.planSalud() !== null), // no inferir sin plan
    tap(() => patchState(store, { infiriendo: true })),
    switchMap((tipoServicio) =>
      useCase.inferirServicio(store.planSalud()!, tipoServicio).pipe(
        tapResponse({
          next: (inferencia) => patchState(store, { inferencia, infiriendo: false }),
          error: () => patchState(store, { infiriendo: false }),
        }),
      ),
    ),
  ),
),`,

    projProvide: `// solicitud-crear.component.ts (página SMART)
@Component({
  providers: [SolicitudCrearStore],   // ← nace y muere con la pantalla
  /* … */
})
export class SolicitudCrearComponent {
  protected readonly store = inject(SolicitudCrearStore);
  constructor() {
    this.store.cargarCatalogos();      // carga inicial al entrar
  }
}`,

    projSection: `// cualquier seccion-*.component.ts — "tonta", se conecta sola al store
export class SeccionServicioComponent {
  protected readonly store = inject(SolicitudCrearStore);
}
// Todas inyectan la MISMA instancia → cero @Input/@Output entre secciones.`,

    projFlow: `1. Entrar          → constructor → store.cargarCatalogos()        (rxMethod)
2. Cobertura       → store.cargarCobertura({tipoId, numeroId})    (rxMethod)
   └─ patchState: paciente + planesSalud
   └─ computed coberturaResuelta = true → se muestra la sección de plan
3. Elegir plan     → store.seleccionarPlan(id)                    (síncrono)
   └─ computed servicioHabilitado = true → se habilita el servicio
4. Elegir servicio → store.seleccionarServicio(codigo)            (rxMethod)
   └─ patchState: inferencia → el resumen muestra el resultado
   └─ computed puedeGuardar = true
5. Guardar         → store.guardar()                              (rxMethod)
   └─ patchState: resultado
6. Salir           → el store se destruye (provider de componente)
   (o «Reiniciar» → store.reiniciar() → initialState)`,
  };
}
