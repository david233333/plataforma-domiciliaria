import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página de documentación sobre la evolución de Angular 18 → 21: el paso a
 * "zoneless", las estrategias de detección de cambios y las signals. Pensada
 * para aprender desde cero, igual que `ArquitecturaEstilosComponent`.
 *
 * Es un componente PURO de documentación: no inyecta servicios, no hace HTTP y
 * no tiene estado vivo. Solo muestra texto explicativo y ejemplos de código.
 *
 * Los snippets viven como strings aquí (no en la plantilla) porque en los
 * templates de Angular los caracteres @, { }, {{ }} y los backticks de las
 * plantillas internas tienen significado especial y romperían el parser. Se
 * renderizan con interpolación segura: <pre class="doc-code">{{ code.xxx }}</pre>.
 */
@Component({
  selector: 'app-novedades-angular',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './novedades-angular.component.html',
  styleUrl: './novedades-angular.component.scss',
})
export class NovedadesAngularComponent {
  /** Snippets de código mostrados en la página. */
  protected readonly code = {
    // ----- 2. Zoneless -----
    bootstrapZoneless: `// antes (clásico): zone.js vigila TODO "por si algo cambió"
import { provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
});

// ahora (zoneless): la detección se basa en signals + eventos del template
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()],
});
// Nota histórica: en v18/19 el provider se llamaba
// provideExperimentalZonelessChangeDetection(); se estabilizó en v20.`,

    quitarZoneJs: `// 1) angular.json — antes zone.js iba como polyfill global:
"polyfills": ["zone.js"],   // ← se ELIMINA en una app zoneless

// 2) package.json — ya no necesitas la dependencia:
//    "zone.js": "~0.15.0"   ← se quita

// 3) El código de siempre SIGUE funcionando en zoneless:
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ datos$ | async }}\`,   // async pipe marca la vista igual
})
export class Demo {
  // markForCheck() también sigue disponible para casos manuales
}`,

    // ----- 3. Change Detection -----
    cdDefault: `// Default (CheckAlways): Angular revisa este componente en CADA ciclo.
@Component({
  selector: 'app-precio',
  changeDetection: ChangeDetectionStrategy.Default, // es el valor por defecto
  template: \`Total: {{ calcularTotal() }}\`,
})
export class PrecioComponent {
  precio = 100;
  iva = 19;
  // OJO: esta función se ejecuta en cada ciclo de detección de cambios.
  calcularTotal() { return this.precio * (1 + this.iva / 100); }
}`,

    cdOnPush: `// OnPush: el componente se revisa SOLO ante disparadores concretos.
@Component({
  selector: 'app-tarjeta-usuario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<h3>{{ usuario.nombre }}</h3>\`,
})
export class TarjetaUsuarioComponent {
  @Input() usuario!: Usuario;
}

// Se vuelve a revisar cuando:
//  1) cambia la REFERENCIA de un @Input() / input()
//  2) ocurre un evento en el componente o en un hijo (click, input, etc.)
//  3) un Observable consumido con | async en el template emite
//  4) se llama a ChangeDetectorRef.markForCheck() a mano
//  5) se LEE una signal en el template (la signal lo notifica sola)`,

    mutacionBug: `// ❌ BUG típico con OnPush: mutar el array NO cambia su referencia,
//    así que el @Input() del hijo "parece" el mismo y la vista no se actualiza.
agregarItem(item: Item) {
  this.items.push(item);              // misma referencia → OnPush no se entera
}

// ✅ CORRECTO: crear una referencia NUEVA (inmutabilidad).
agregarItem(item: Item) {
  this.items = [...this.items, item]; // nueva referencia → OnPush sí detecta
}
// Regla mental: con OnPush, Angular compara POR REFERENCIA, no por contenido.`,

    cdRefApis: `constructor(private cdr: ChangeDetectorRef) {}

// markForCheck(): marca este componente y sus ancestros para el PRÓXIMO ciclo.
//   Úsalo con OnPush cuando cambiaste algo fuera de los 5 disparadores.
this.cdr.markForCheck();

// detectChanges(): corre la detección de ESTE componente y sus hijos YA, ahora.
this.cdr.detectChanges();

// detach() + reattach(): saca/mete el componente del árbol de detección.
//   Útil para listas enormes o datos que cambian muchísimas veces por segundo.
this.cdr.detach();
//   ...actualizo cuando me conviene y pinto a mano...
this.cdr.detectChanges();
this.cdr.reattach();`,

    signalOnPush: `// Con signals NO necesitas markForCheck: leer la signal en el template
// "suscribe" la vista y la marca sola cuando el valor cambia.
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ contador() }}\`,
})
export class ContadorComponent {
  contador = signal(0);
  // Al hacer set/update, la vista que lee contador() se marca automáticamente.
  incrementar() { this.contador.update(n => n + 1); }
}
// Por eso "zoneless" se comporta, a grandes rasgos, como tener OnPush en todo
// el árbol: solo se revisa lo que realmente cambió (signals + eventos).`,

    // ----- 4. Signals a fondo -----
    signalBasics: `import { signal, computed, effect } from '@angular/core';

const contador = signal(0);                     // estado escribible
const doble = computed(() => contador() * 2);   // derivado, SOLO lectura

contador();        // leer → 0
doble();           // leer → 0

contador.set(5);              // fijar un valor concreto
contador.update(n => n + 1);  // calcular a partir del anterior → 6
doble();                      // → 12 (se recalcula solo: perezoso y cacheado)

// effect: corre un efecto secundario cada vez que cambian las signals que lee.
effect(() => console.log('el contador cambió a', contador()));`,

    mutateRemoved: `// antes (Angular 16/17, cuando signals era experimental): existía .mutate()
contador.mutate(arr => arr.push(1));   // ❌ ELIMINADO en las signals estables

// ¿por qué se quitó? mutar en sitio no cambia la referencia y se prestaba a
// bugs (como con OnPush). update() obliga a devolver un valor nuevo:
lista.update(arr => [...arr, 1]);      // ahora: copia inmutable`,

    linkedResource: `import { signal, linkedSignal, resource } from '@angular/core';

// linkedSignal: derivado pero ESCRIBIBLE. Sigue a su fuente, y aun así
// permite sobreescribirlo a mano (se "reengancha" si la fuente cambia).
const opciones = signal(['A', 'B', 'C']);
const elegido = linkedSignal(() => opciones()[0]); // por defecto, el primero
elegido.set('B');                                  // override puntual del usuario

// resource(): estado ASÍNCRONO declarativo (valor, cargando, error).
const usuario = resource({
  params: () => ({ id: idSeleccionado() }),       // se recarga si cambia el id
  loader: ({ params }) => fetch(\`/api/users/\${params.id}\`).then(r => r.json()),
});
usuario.value();      // datos | undefined
usuario.isLoading();  // boolean
usuario.error();      // error | undefined
// httpResource() es la variante que usa el HttpClient de Angular.`,

    interop: `import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable → Signal (se suscribe y se desuscribe solo; no fugas de memoria)
const usuario = toSignal(usuario$, { initialValue: null });

// Signal → Observable (para enchufar los operadores de RxJS)
import { debounceTime } from 'rxjs';
const termino = signal('');
const termino$ = toObservable(termino).pipe(debounceTime(300));`,

    signalIo: `// antes (clásico): decoradores
@Input() id!: string;
@Output() guardar = new EventEmitter<Usuario>();

// ahora (v19+, estable): funciones que devuelven signals
id     = input.required<string>();   // input de solo lectura, obligatorio
nombre = input('');                  // input con valor por defecto
guardar = output<Usuario>();         // reemplaza a @Output

// model(): two-way binding con signal  →  <app-x [(valor)]="texto" />
valor = model('');

// view/content queries como signals
boton = viewChild<ElementRef>('btn');        // antes: @ViewChild
items = contentChildren(ItemComponent);      // antes: @ContentChildren`,

    contadorCompleto: `@Component({
  selector: 'app-contador',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button (click)="restar()">-</button>
    <span>{{ valor() }}</span>
    <button (click)="sumar()">+</button>
    <p>El doble es: {{ doble() }}</p>
  \`,
})
export class ContadorComponent {
  protected readonly valor = signal(0);                     // estado
  protected readonly doble = computed(() => this.valor() * 2); // derivado

  protected sumar()  { this.valor.update(n => n + 1); }
  protected restar() { this.valor.update(n => n - 1); }
}`,

    // ----- 5. Signals vs RxJS -----
    signalsVsRxjs: `// Búsqueda con debounce: aquí RxJS BRILLA (eventos a lo largo del tiempo).
const termino = signal('');                 // estado de UI → signal

const resultados = toSignal(
  toObservable(termino).pipe(
    debounceTime(300),         // espera a que el usuario deje de teclear
    distinctUntilChanged(),    // ignora repetidos
    switchMap(t => this.api.buscar(t)),  // cancela la búsqueda anterior
  ),
  { initialValue: [] },
);
// El RESULTADO vuelve a ser una signal: cómodo de leer en el template con
// resultados(). Patrón recomendado: RxJS para el flujo, signal para el estado.`,

    // ----- 6. Signal Forms -----
    signalForms: `// EXPERIMENTAL en v21 — formularios construidos sobre signals
// (la API todavía puede cambiar; no usar aún en producción).
import { form, required, email } from '@angular/forms/signals';

const modelo = signal({ nombre: '', email: '' });

const f = form(modelo, (campo) => {
  required(campo.nombre);
  email(campo.email);
});

// Todo es reactivo vía signals:
f.nombre().value();    // valor actual
f.email().errors();    // errores de validación
f().valid();           // ¿el formulario completo es válido?`,
  };
}
