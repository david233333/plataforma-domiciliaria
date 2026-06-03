# Arquitectura — Clean Architecture (Angular 21)

Este proyecto sigue **Clean Architecture estricta**. Las dependencias apuntan
**siempre hacia adentro** (hacia `domain`). Una capa solo conoce a las de adentro.

```
presentation  ─────►  application  ─────►  domain  ◄─────  infrastructure
   (Angular)            (DI + facades            (TS puro)        (adapters HTTP,
                         excepcionales)                            implementa puertos)
        │                                                              ▲
        └────────────────────────► core / shared ◄─────────────────────┘
```

## Las 6 zonas (`src/app/`)

| Capa | Qué contiene | Puede importar |
|------|--------------|----------------|
| `domain` | **TypeScript puro**: entidades, value objects, puertos (abstract class), casos de uso, errores. `rxjs` permitido; `@angular/*` y `primeng` **prohibidos**. | `domain` |
| `application` | Cableado de DI (`di/`) y, excepcionalmente, facades de estado compartido. | `application`, `domain`, `shared` |
| `infrastructure` | Adaptadores que implementan los puertos con `HttpClient`; DTOs y mappers (DTO↔Entity). | `infrastructure`, `domain`, `shared` |
| `presentation` | Angular: componentes, templates, rutas. Inyecta **casos de uso** directo; estado en signals locales. | `presentation`, `application`, `domain`, `core`, `shared` |
| `core` | Singletons framework app-wide: auth, interceptores, i18n, layout. | `core`, `shared` |
| `shared` | UI tonta y utilidades **sin negocio**. | `shared` |

La regla se **enforce con ESLint** (`eslint-plugin-boundaries` +
`no-restricted-imports` en `domain`). Ver `eslint.config.mjs`. `ng lint` falla si
se viola la frontera o si `domain` importa Angular/PrimeNG.

## Convención de nombres (el sufijo delata la capa)

| Artefacto | Sufijo | Capa |
|-----------|--------|------|
| Entidad | `*.entity.ts` | domain |
| Value object / enum con lógica | nombre claro (`estado-novedad.ts`) | domain |
| Puerto | `*.repository.ts`, `*.port.ts` | domain/ports |
| Caso de uso | `*.use-case.ts` | domain/use-cases |
| Error de dominio | `*Error` (clase) | domain/errors |
| Facade | `*.facade.ts` | application |
| Adaptador | `*-http.repository.ts`, `*.adapter.ts` | infrastructure |
| DTO / Mapper | `*.dto.ts` / `*.mapper.ts` | infrastructure |
| Componente / Rutas | `*.component.ts` / `*.routes.ts` | presentation |
| Guard / Interceptor | `*.guard.ts` / `*.interceptor.ts` | core |

## Puertos y DI

Cada puerto es una **`abstract class`** en `domain/ports`: es contrato y, a la
vez, token de inyección. El cableado puerto→adaptador y la exposición de los
casos de uso (por **factory**, para no acoplar el dominio a Angular) viven en
`application/di/*.providers.ts`:

```ts
export function provideNovedades(): Provider[] {
  return [
    { provide: NovedadRepository, useClass: NovedadHttpRepository },
    { provide: BuscarNovedadesUseCase,
      useFactory: () => new BuscarNovedadesUseCase(inject(NovedadRepository)) },
    { provide: GestionarNovedadUseCase,
      useFactory: () => new GestionarNovedadUseCase(inject(NovedadRepository)) },
  ];
}
```

`provideNovedades()` se registra en los `providers` de la **ruta lazy** del slice
(aislamiento). `provideNotificaciones()` se registra en `app.config.ts` porque su
facade es singleton root.

## ¿Facade o caso de uso directo? (decisión por defecto: SIN facade)

**Por defecto NO hay facades.** El componente inyecta los casos de uso directo y
guarda el estado de la pantalla en **signals locales**. Así se evitan capas que
solo reenvían llamadas.

```ts
export class GestionarNovedadesComponent {
  private readonly buscarNovedades = inject(BuscarNovedadesUseCase);
  protected readonly novedades = signal<Novedad[]>([]);
  protected readonly buscando = signal(false);
  // ...
}
```

**Usa un facade SOLO si** el estado se comparte entre varios componentes,
sobrevive a la navegación, u orquesta varios casos de uso con estado común.

En este repo hay **un único** facade de ejemplo: `notificaciones`
(`application/notificaciones/notificaciones.facade.ts`). Ahí el facade **sí**
aporta valor: `noLeidas()` lo consume el badge del header y `items()` el panel —
dos componentes leyendo el **mismo** estado. Si viviera dentro de un componente,
el otro no lo vería. `novedades` deliberadamente **no** usa facade, para tener
ambos enfoques lado a lado antes de decidir si se generaliza.

## HTTP y múltiples APIs

`environment.apis` mapea una base por servicio. Cada adaptador arma su URL con el
helper `infrastructure/http/api-url.ts` y debe traducir errores HTTP a **errores
de dominio** con `catchError` (no dejar escapar `HttpErrorResponse`). Hoy los
adaptadores devuelven datos mock vía `of(...)` (ver los `// TODO`).

## Cómo añadir un nuevo slice (plantilla: copia de `novedades`)

1. **domain/<slice>/entities/** — entidad(es) + value objects con sus reglas.
2. **domain/<slice>/ports/** — puerto como `abstract class` (métodos → `Observable<T>`).
3. **domain/<slice>/use-cases/** — un caso de uso por responsabilidad; puerto por
   constructor; reglas de negocio aquí o en la entidad. Errores en
   `domain/<slice>/errors/` extendiendo `DomainError`.
4. **infrastructure/<slice>/** — `*.dto.ts`, `*.mapper.ts` (DTO↔Entity) y
   `*-http.repository.ts` que `extends` el puerto e implementa con `HttpClient`.
5. **application/di/<slice>.providers.ts** — `provide<Slice>()`: puerto→adaptador
   + casos de uso por factory.
6. **presentation/<slice>/** — componente(s) `OnPush` que **inyectan los casos de
   uso** y mantienen signals locales; `*.labels.ts` para los strings de UI;
   `<slice>.routes.ts` que registra `provide<Slice>()` en `providers` y hace
   `loadComponent`.
7. **app.routes.ts** — añade la ruta lazy con `loadChildren`.
8. **Tests** — `use-case.spec.ts` (POJO + mock del puerto, sin TestBed),
   `entity/vo .spec.ts` (reglas), `mapper.spec.ts` (ida y vuelta). Si hay facade,
   `facade.spec.ts` con el puerto/caso de uso mockeado.

> Si el estado fuera compartido, añade además `application/<slice>/<slice>.facade.ts`
> y registra el provider del caso de uso a nivel app.

## i18n y testing (estado actual)

- **i18n**: solo PREPARADO. `provideI18n()` registra locale **es-CO** y `LOCALE_ID`.
  Sin librería de traducción. Convención de strings en `core/i18n/README.md`.
- **Testing**: solo unitarios con **Vitest** (`ng test`). Sin e2e.
