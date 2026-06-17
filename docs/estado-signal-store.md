# Gestión de estado con SignalStore (`@ngrx/signals`)

Esta guía explica **qué es** y **cómo funciona** `@ngrx/signals` (el *SignalStore*
de NgRx) de forma general, y luego **cómo está implementado** en este proyecto en
la pantalla «crear solicitud no hospitalaria».

> Versión usada: `@ngrx/signals` `^21.1.1` y `@ngrx/operators` `^21.1.1`
> (ver `package.json`). Requiere Angular con signals (v17+; aquí v21).

---

## Parte 1 — Qué es `@ngrx/signals` y cómo funciona

### 1.1 Punto de partida: los signals de Angular

Un **signal** es un contenedor reactivo de un valor. Cuando el valor cambia,
todo lo que lo lee (el template, un `computed`, un `effect`) se actualiza solo,
sin `Zone.js` ni `ChangeDetectionStrategy` manual.

```ts
const contador = signal(0);     // signal escribible
contador();                     // leer → 0
contador.set(1);                // escribir
contador.update((n) => n + 1);  // escribir derivando del anterior

const doble = computed(() => contador() * 2); // signal derivado (solo lectura)
```

Esto resuelve la reactividad de **un** valor. El problema empieza cuando tienes
**muchos** valores relacionados, lógica derivada y operaciones asíncronas: acabas
con un servicio lleno de signals sueltos, métodos `subscribe()` manuales y
limpieza de suscripciones a mano. Ahí entra el SignalStore.

### 1.2 Qué es el SignalStore

`signalStore(...)` es una **factoría que construye un servicio Angular** (una
clase inyectable) cuyo estado son signals. No es una librería de "store global"
al estilo Redux clásico: es un **contenedor de estado componible**. En lugar de
escribir la clase a mano, la **ensamblas con "features"**:

```ts
export const MiStore = signalStore(
  withState(...),     // el estado (datos)
  withComputed(...),  // lo derivado (como computed)
  withMethods(...),   // las acciones (cómo cambia el estado)
  withHooks(...),     // ciclo de vida (onInit / onDestroy) — opcional
);
```

El resultado (`MiStore`) es una **clase**: se registra como provider y se inyecta
con `inject(MiStore)`. Cada feature aporta una parte y **las siguientes ven lo
que aportaron las anteriores** (los `computed` pueden leer el state, los métodos
pueden leer state y computed).

Ventajas frente a signals sueltos en un servicio:

- **Estado tipado y centralizado** en una sola forma (`type ...State`).
- Cada campo del estado se expone como **signal de solo lectura** → la UI no
  puede mutarlo por la espalda; solo los métodos del store lo cambian.
- **Integración con RxJS** para lo asíncrono (`rxMethod`) con auto-limpieza de
  suscripciones.
- Composición y reutilización (puedes extraer features propias).

### 1.3 Las "features" en detalle

#### `withState(initialState)`

Define la **forma del estado**. Cada propiedad del objeto inicial se convierte en
un signal de solo lectura accesible como método:

```ts
type State = { nombre: string; items: number[]; cargando: boolean };
const initialState: State = { nombre: '', items: [], cargando: false };

withState(initialState)
// → store.nombre()  store.items()  store.cargando()
```

#### `withComputed((store) => ({ ... }))`

Estado **derivado**. Son `computed()` que se recalculan solos cuando cambian sus
fuentes. Sirve para no duplicar lógica en los templates:

```ts
withComputed((store) => ({
  hayItems: computed(() => store.items().length > 0),
}))
// → store.hayItems()
```

#### `withMethods((store, dep = inject(Dep)) => ({ ... }))`

Las **acciones**: la única vía para cambiar el estado. Aquí puedes inyectar
dependencias (servicios, casos de uso) en los parámetros por defecto.

- **Cambios síncronos** → `patchState(store, parcial)`.
- **Cadenas asíncronas** → `rxMethod` (ver abajo).

```ts
withMethods((store, api = inject(Api)) => ({
  setNombre(nombre: string) {
    patchState(store, { nombre });       // síncrono
  },
}))
```

#### `withHooks({ onInit, onDestroy })` (opcional)

Engancha el ciclo de vida del store (p. ej. cargar datos al crear). En este
proyecto la carga inicial se hace desde el constructor del componente, así que no
se usa, pero existe.

### 1.4 `patchState` — cómo se muta el estado

`patchState` es **la** forma de actualizar. Aplica un parche **inmutable**:
reemplaza solo las claves que pasas y deja el resto igual.

```ts
patchState(store, { cargando: true });               // objeto parcial
patchState(store, (s) => ({ items: [...s.items] }));  // updater (lee el actual)
patchState(store, initialState);                      // reset completo
```

Nunca se mutan los signals directamente desde fuera: el estado es de solo lectura
hacia afuera y `patchState` es el único canal de escritura.

### 1.5 `rxMethod` — lo asíncrono (de `@ngrx/signals/rxjs-interop`)

`rxMethod` crea un **método reactivo** a partir de un *pipe* de RxJS. Lo llamas
como una función normal y él:

1. gestiona la suscripción **y la limpia** cuando el store se destruye (adiós al
   `takeUntilDestroyed` / `subscribe` manual);
2. acepta como entrada un valor, un signal o un observable.

```ts
buscar: rxMethod<string>(
  pipe(
    tap(() => patchState(store, { cargando: true })),
    switchMap((q) => api.buscar(q).pipe(
      tapResponse({
        next: (items) => patchState(store, { items, cargando: false }),
        error: () => patchState(store, { cargando: false }),
      }),
    )),
  ),
)
// uso: store.buscar('texto')
```

`switchMap` aquí **cancela** una petición anterior si llega otra (evita
resultados "fantasma" que llegan tarde y pisan los nuevos).

### 1.6 `tapResponse` — manejar el error sin romper el stream

(De `@ngrx/operators`.) Regla de oro de `rxMethod`: **si un error sube hasta el
`rxMethod`, el método "muere" y deja de reaccionar** a futuras llamadas.
`tapResponse` captura `next`/`error` **dentro** del stream, de modo que el error
se gestiona localmente (apagar el spinner, etc.) y la cadena reactiva sigue viva.

```ts
api.guardar(cmd).pipe(
  tapResponse({
    next: (r) => patchState(store, { resultado: r }),
    error: () => patchState(store, { guardando: false }),
  }),
)
```

### 1.7 Dónde se provee: `root` vs nivel de componente

- `signalStore({ providedIn: 'root' }, ...)` → **singleton** para toda la app
  (estado global persistente).
- `signalStore(...)` sin `providedIn` + registrarlo en `providers: [...]` de un
  **componente/ruta** → su ciclo de vida es **el de esa pantalla**: nace al
  entrar y muere al salir. Ideal para estado de un flujo o formulario: entras
  limpio, sin resets manuales.

Este proyecto usa la **segunda** forma (estado por pantalla).

---

## Parte 2 — Cómo está implementado en el proyecto

La única implementación de SignalStore vive en la feature **«crear solicitud no
hospitalaria»**:

```
src/app/presentation/no-hospitalario/solicitud-crear/
├── solicitud-crear.store.ts        ← el SignalStore (estado del flujo)
├── solicitud-crear.component.ts     ← página SMART: provee y orquesta
├── solicitud-crear.routes.ts        ← ruta lazy + DI del slice
└── sections/
    ├── seccion-cobertura/           ← secciones "tontas": leen/escriben el store
    ├── seccion-paciente/
    ├── seccion-servicio/
    └── resumen-solicitud/
```

### 2.1 Encaje con la Clean Architecture

El SignalStore vive en la **capa de presentación** (usa Angular DI). **No
reemplaza al dominio**: el caso de uso (`SolicitudUseCase`, TypeScript puro) sigue
teniendo la lógica de negocio, y el store lo **consume**.

```
seccion-*.component  ──►  SolicitudCrearStore  ──►  SolicitudUseCase  ──►  SolicitudRepository
   (presentation)          (presentation/estado)      (domain, TS puro)        (infrastructure)
```

El caso de uso se cablea por **factory** en `application/di/solicitud.providers.ts`
y se registra a nivel de **ruta lazy** (`solicitud-crear.routes.ts`), de modo que
el slice (puerto→adaptador→caso de uso) solo existe mientras la feature está
cargada. El store hace `inject(SolicitudUseCase)` dentro de `withMethods`.

### 2.2 Ciclo de vida: estado por pantalla

El store **no** es `providedIn: 'root'`. Se registra en los `providers` del
componente página:

```ts
// solicitud-crear.component.ts
@Component({
  providers: [SolicitudCrearStore],   // ← nace y muere con la pantalla
  // ...
})
export class SolicitudCrearComponent {
  protected readonly store = inject(SolicitudCrearStore);

  constructor() {
    this.store.cargarCatalogos();      // carga inicial al entrar
  }
}
```

Cada vez que entras a «Nueva solicitud» empiezas limpio, sin resets manuales.

### 2.3 El estado (`withState`)

`SolicitudCrearState` es la **única fuente de verdad** del flujo: aquí viven las
selecciones e inferencias. Hay **una bandera de carga por operación asíncrona**
para tener spinners independientes:

```ts
type SolicitudCrearState = {
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
  // Banderas de carga (spinners independientes)
  cargandoCobertura: boolean;
  infiriendo: boolean;
  guardando: boolean;
};
```

> Los **catálogos de los dropdowns** que no son del flujo (p. ej. tipos de
> identificación) **no** van en el store: son del componente que los pinta.

### 2.4 Lo derivado (`withComputed`): la UI no decide, refleja

Los `computed` **desbloquean las secciones progresivas** y arman el resumen. Las
secciones solo leen estos cálculos; no contienen lógica de habilitación:

```ts
withComputed((store) => ({
  coberturaResuelta: computed(() => store.paciente() !== null),
  servicioHabilitado: computed(() => store.planSalud() !== null),
  puedeGuardar: computed(() => store.inferencia() !== null && !store.guardando()),
  nombrePaciente: computed(() => { /* … */ }),
  nombrePlan:     computed(() => /* busca el nombre por id */),
  nombreServicio: computed(() => /* busca el nombre por código */),
}))
```

En el template, esto se traduce en habilitar/deshabilitar controles sin lógica:

```html
<!-- seccion-servicio.component.html -->
<p-select
  [ngModel]="store.tipoServicio()"
  (ngModelChange)="store.seleccionarServicio($event)"
  [options]="store.tiposServicio()"
  [disabled]="!store.servicioHabilitado()" />

@if (store.infiriendo()) {
  <app-icon name="spinner" [spin]="true" /> Infiriendo datos del servicio…
}
```

### 2.5 Las acciones (`withMethods`): síncronas y asíncronas

El caso de uso se inyecta **una sola vez** como parámetro por defecto:

```ts
withMethods((store, useCase = inject(SolicitudUseCase)) => ({ ... }))
```

**Síncronas** (selección que limpia lo que depende de ella):

```ts
seleccionarPlan(planSalud: string | null): void {
  patchState(store, { planSalud, tipoServicio: null, inferencia: null });
},
reiniciar(): void {
  patchState(store, initialState);   // reset completo
},
```

**Asíncronas con `rxMethod`** (reemplazan el `subscribe` + `takeUntilDestroyed`
del enfoque legacy). Ejemplo: cargar cobertura y, encadenado, sus planes:

```ts
cargarCobertura: rxMethod<{ tipoId: string; numeroId: string }>(
  pipe(
    tap(() => patchState(store, { cargandoCobertura: true, paciente: null, /* …limpia dependientes… */ })),
    switchMap(({ tipoId, numeroId }) =>          // ← cancela una consulta anterior
      useCase.consultarCobertura(tipoId, numeroId).pipe(
        switchMap((paciente) =>
          useCase.consultarPlanesDisponibles(paciente).pipe(
            tapResponse({                         // ← error capturado dentro del stream
              next: (planesSalud) => patchState(store, { paciente, planesSalud, cargandoCobertura: false }),
              error: () => patchState(store, { cargandoCobertura: false }),
            }),
          ),
        ),
      ),
    ),
  ),
),
```

Patrón con `filter` para no disparar trabajo inválido (inferir solo si hay plan):

```ts
seleccionarServicio: rxMethod<string | null>(
  pipe(
    tap((tipoServicio) => patchState(store, { tipoServicio, inferencia: null })),
    filter((s): s is string => s !== null && store.planSalud() !== null),
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
),
```

`guardar` ensambla el comando **desde el estado actual** del store y delega en
`useCase.guardar(...)`, guardando el `resultado`.

### 2.6 Comunicación entre secciones: cero `@Input`/`@Output`

La página es **SMART**: provee el store y compone las secciones; casi no tiene
lógica. Cada sección es "tonta" y **se conecta al store por su cuenta**:

```ts
// cualquier seccion-*.component.ts
export class SeccionServicioComponent {
  protected readonly store = inject(SolicitudCrearStore);
}
```

Como todas inyectan **la misma instancia** (provista en la página), no necesitan
pasarse datos por `@Input`/`@Output`: leen los signals y llaman a los métodos del
store directamente. Esto elimina el "prop drilling" entre secciones del flujo.

### 2.7 Flujo completo (de un vistazo)

```
1. Entrar a la pantalla
   └─ component.constructor → store.cargarCatalogos()   (rxMethod → tiposServicio)

2. seccion-cobertura  → store.cargarCobertura({tipoId, numeroId})
   └─ rxMethod: consultarCobertura → consultarPlanesDisponibles
   └─ patchState: paciente + planesSalud
   └─ computed coberturaResuelta = true  → se muestra seccion-paciente/plan

3. Elegir plan       → store.seleccionarPlan(id)   (síncrono)
   └─ computed servicioHabilitado = true → se habilita seccion-servicio

4. seccion-servicio  → store.seleccionarServicio(codigo)
   └─ rxMethod: inferirServicio (cascada de dominio)
   └─ patchState: inferencia    → resumen-solicitud muestra el resultado
   └─ computed puedeGuardar = true

5. Guardar           → store.guardar()
   └─ rxMethod: useCase.guardar(comando-armado-desde-el-estado)
   └─ patchState: resultado

6. Salir de la pantalla → el store se destruye (provider de componente)
   (o botón «Reiniciar» → store.reiniciar() → initialState)
```

---

## Referencias rápidas

| Concepto | API | De dónde viene |
|----------|-----|----------------|
| Crear el store | `signalStore(...)` | `@ngrx/signals` |
| Definir estado | `withState(initial)` | `@ngrx/signals` |
| Estado derivado | `withComputed((s) => ({...}))` | `@ngrx/signals` |
| Acciones | `withMethods((s, dep=inject()) => ({...}))` | `@ngrx/signals` |
| Mutar estado | `patchState(store, parcial)` | `@ngrx/signals` |
| Acción asíncrona | `rxMethod<T>(pipe(...))` | `@ngrx/signals/rxjs-interop` |
| Manejo de error en stream | `tapResponse({ next, error })` | `@ngrx/operators` |
| Ciclo de vida | `withHooks({ onInit, onDestroy })` | `@ngrx/signals` |

**Archivo de referencia en el repo:**
`src/app/presentation/no-hospitalario/solicitud-crear/solicitud-crear.store.ts`
(está comentado a fondo). Ver también `docs/ARQUITECTURA.md` para el encaje en
las capas.
