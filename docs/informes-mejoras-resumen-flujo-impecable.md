# Resumen detallado: mejoras al módulo de Informes

> Documento educativo. Explica **paso por paso** qué se hizo en el módulo de
> informes (hospitalario y no hospitalario), qué comando lanzó cada cambio, y
> **qué significa cada concepto técnico** en lenguaje sencillo. Pensado para
> leerse sin dar por sabido nada.

---

## 0. Contexto: ¿qué herramienta usamos?

Todo el trabajo se hizo con un **skill** llamado `impeccable`. Un *skill* es un
asistente especializado dentro de Claude Code: un conjunto de instrucciones y
sub-comandos enfocados en diseñar y mejorar interfaces (la parte visual y de
experiencia de uso de la app).

Se invoca escribiendo `/impeccable <comando>`. Cada **comando** hace un tipo de
mejora distinta. Nosotros usamos seis, en este orden:

| # | Comando | Para qué sirve |
|---|---------|----------------|
| 1 | `audit` | **Auditar**: revisar la pantalla y listar problemas (no arregla nada) |
| 2 | `harden` | **Endurecer**: hacer el formulario robusto (errores, accesibilidad) |
| 3 | `onboard` | **Primer uso**: estados vacíos y que el usuario llegue al valor rápido |
| 4 | `layout` | **Composición**: espaciado, jerarquía, consistencia visual |
| 5 | `typeset` | **Tipografía**: jerarquía de textos y detalles tipográficos |
| 6 | `polish` | **Pulido final**: detalles pequeños antes de entregar |

Antes de tocar nada, el skill creó un archivo `PRODUCT.md` en la raíz del
proyecto. Ese archivo describe qué es el producto, quién lo usa y qué
personalidad debe tener ("clínico, confiable, calmado"). Sirve para que todas
las decisiones de diseño estén calibradas al mismo objetivo.

### Las dos pantallas sobre las que trabajamos

- `informes-nh` → **no hospitalario** (`/no-hospitalario/informes`)
- `informes-h` → **hospitalario** (`/hospitalario/informes`)

Ambas son pantallas para **generar y descargar informes operativos**: el
coordinador elige un informe, configura filtros (servicio, ciudad/sede, rango de
fechas) y descarga un archivo CSV.

---

## 1. Conceptos base que se repiten (léelos primero)

Estos términos aparecen en todo el documento. Aquí van explicados una sola vez.

### Angular y sus piezas

- **Componente**: una pieza de pantalla. Tiene 3 archivos:
  - `.ts` → la lógica (TypeScript, el "cerebro").
  - `.html` → la estructura visual (la "plantilla").
  - `.scss` → los estilos (colores, tamaños, espaciado).

- **Signal (señal)**: una caja que guarda un valor y **avisa automáticamente**
  cuando ese valor cambia, para que la pantalla se vuelva a dibujar. Es la forma
  moderna de Angular de manejar "estado" (datos que cambian). Ejemplo:
  `descargando` es un signal `true/false` que dice si hay una descarga en curso.

- **`computed` (calculado)**: un signal que se **deriva** de otros. No lo
  asignas tú a mano; se recalcula solo cuando cambian los signals de los que
  depende. Ejemplo: "¿debo mostrar el error de este campo?" es un `computed` que
  depende de si el campo es inválido y de si el usuario ya interactuó.

- **OnPush**: una estrategia de rendimiento. Por defecto Angular revisa toda la
  pantalla muy seguido por si algo cambió (gasta CPU). Con `OnPush` le dices:
  "solo redibuja cuando cambie un signal o una entrada concreta". Es más rápido,
  pero **obliga** a manejar el estado con signals (si no, la pantalla no se
  entera de los cambios). Por eso varias soluciones de abajo usan signals.

### Formularios reactivos (Reactive Forms)

- **Reactive Form**: la forma de Angular de manejar formularios desde el `.ts`
  (no desde el HTML). Defines los campos, sus valores y sus **reglas de
  validación** en código.

- **Validator (validador)**: una regla. Ej: `Validators.required` = "este campo
  es obligatorio". Si no se cumple, el campo queda **inválido**.

- **Validación cruzada**: una regla que mira **varios campos a la vez**. Ej: "la
  fecha de fin no puede ser anterior a la de inicio" necesita comparar dos
  campos, así que vive en el grupo, no en un campo solo.

- **`touched` (tocado)**: Angular marca un campo como "tocado" cuando el usuario
  entra y sale de él. Sirve para **no mostrar errores antes de tiempo** (no
  quieres gritarle "¡campo vacío!" a alguien que aún no llegó a ese campo).

### Accesibilidad (a11y) y WCAG

- **Accesibilidad / a11y**: que la app la pueda usar todo el mundo, incluyendo
  personas con **lector de pantalla** (software que lee la pantalla en voz alta
  para personas ciegas) o que navegan **solo con teclado**.

- **WCAG AA**: el estándar internacional de accesibilidad. "AA" es el nivel
  objetivo. Incluye, por ejemplo, que el texto tenga **suficiente contraste** con
  el fondo (relación mínima 4.5:1 para texto normal).

- **Atributos ARIA**: marcas invisibles en el HTML que le explican al lector de
  pantalla qué es cada cosa. Los que usamos:
  - `role="alert"` → "esto es una alerta, léela en cuanto aparezca".
  - `role="status"` + `aria-live="polite"` → "esto es un estado que cambia,
    anúncialo cuando puedas, sin interrumpir".
  - `aria-invalid` → "este campo tiene un error".
  - `aria-hidden="true"` → "ignora esto" (para iconos decorativos).
  - `aria-label` → "el nombre hablado de este elemento".

### PrimeNG y Tailwind

- **PrimeNG**: una librería de componentes ya hechos (selectores, calendarios,
  botones, barra de progreso). En el HTML aparecen como `<p-select>`,
  `<p-multiselect>`, `<p-datepicker>`, `<p-button>`, `<p-progressbar>`.

- **Tailwind**: una forma de poner estilos escribiendo "clases utilitarias"
  directamente en el HTML. Ej: `flex` (poner en fila), `gap-4` (separación),
  `max-w-2xl` (ancho máximo).

- **Design tokens (`--app-*`)**: variables de diseño centralizadas. En vez de
  escribir un color suelto, usas `var(--app-surface-200)`. Así, si cambia la
  paleta, cambia en un solo lugar. El proyecto ya tenía un sistema de tokens muy
  cuidado (con los contrastes WCAG documentados).

---

## 2. Comando `audit` — Auditoría (diagnóstico)

**Qué hace**: revisa las pantallas y produce un **informe de problemas**. No
modifica código; solo diagnostica y prioriza.

**Cómo prioriza** (severidad):
- **P0** = crítico · **P1** = importante · **P2** = medio · **P3** = menor.

**Resultado**: 16/20 de salud. Los hallazgos principales fueron:

1. **(P1) El formulario solo "avisaba" deshabilitando el botón.** Si faltaban
   campos, el botón "Descargar" se ponía gris y ya. Nunca decía *qué* faltaba.
   Para alguien con lector de pantalla, esto es un callejón sin salida: no puede
   enviar y tampoco sabe por qué.
2. **(P2) El estado vacío de hospitalario no enseñaba nada** ("Aún no hay
   informes disponibles") y además no usaba el patrón de diseño que el proyecto
   ya tenía para estados vacíos.
3. **(P2) El error de fechas no estaba bien conectado** con los campos a nivel
   de accesibilidad.
4. **(P2) Un "Paso 1" huérfano**: había una insignia numerada "1" pero no había
   "2". Una secuencia que numera solo su primer elemento se ve como andamiaje
   olvidado.
5. **(P3) Un "eyebrow"** (etiqueta pequeña en MAYÚSCULAS encima del título). Es
   un cliché de plantillas generadas por IA.
6. **(P3) Un estilo escrito "a mano"** (`style="border-top:..."`) en vez de usar
   el sistema de clases del proyecto.

Estos hallazgos se convirtieron en la lista de tareas que resolvieron los
siguientes comandos.

---

## 3. Comando `harden` — Endurecer el formulario

**Objetivo**: que el formulario funcione bien con datos reales y sea accesible.
Atacó el P1 y dos hallazgos de accesibilidad de golpe.

### 3.1. Validar al enviar, en vez de bloquear el botón

**Antes**: el botón estaba deshabilitado mientras el formulario fuera inválido.

**Ahora**: el botón está **siempre habilitado**. Al pulsarlo, si algo falta:
1. Se marcan todos los campos como "tocados" (`markAllAsTouched`).
2. Aparecen los mensajes de error de cada campo.
3. El foco salta automáticamente al **primer campo con error**.

**Por qué es mejor**: el usuario recibe una explicación ("falta esto") en lugar
de un botón muerto sin pistas. Es la práctica recomendada de accesibilidad.

*Concepto — "mover el foco":* el "foco" es el elemento donde está parado el
teclado. Mover el foco al primer error significa que quien navega con teclado
aterriza directo en el problema, sin tener que buscarlo.

### 3.2. Mensajes de error por campo, anunciados al lector de pantalla

Debajo de cada campo obligatorio se agregó un mensaje (ej: "Selecciona al menos
un tipo de servicio.") que:
- Solo aparece tras tocar el campo o intentar enviar (no antes).
- Lleva `role="alert"` → el lector de pantalla lo lee **en cuanto aparece**.
- Vive dentro de un `.field__message-slot`, un contenedor que **reserva la altura
  de una línea** aunque esté vacío.

*Concepto — "reservar altura / layout shift":* "layout shift" es cuando el
contenido **salta** porque algo apareció y empujó lo demás. Reservar la altura
del mensaje hace que el espacio ya esté ahí desde el principio, así al aparecer
el error nada brinca. Es más cómodo y se ve más profesional.

### 3.3. Estado visual "inválido" en los controles

A cada control de PrimeNG se le pasó `[invalid]="..."`. Eso le pinta un borde
rojo cuando hay error. **El color no es la única señal** (también está el texto y
un icono de alerta), porque depender solo del color excluye a personas
daltónicas (regla de WCAG).

### 3.4. Detalle técnico importante: PrimeNG y los atributos ARIA

Investigando la librería se descubrió que los componentes de PrimeNG
(`multiselect`, `select`, `datepicker`) **no exponen** los atributos
`aria-describedby` ni `aria-invalid` en su elemento interno real. El plan
original del audit asumía usarlos, pero habrían sido "decorativos": puestos en un
sitio que el lector de pantalla nunca lee.

**Decisión honesta**: en lugar de fingir esa conexión, se usó lo que sí funciona
de verdad: `[invalid]` (visual) + mensajes con `role="alert"` (que sí se
anuncian) + mover el foco al error. Accesibilidad real, no de fachada.

### 3.5. Foco al revelarse el formulario

Cuando el usuario elige un informe, aparece la tarjeta de filtros. Se añadió que
el foco salte al título de esa tarjeta al aparecer, para que quien usa teclado no
se quede "atrás" en el selector.

*Conceptos técnicos usados aquí:*
- **`viewChild`**: una forma de que el `.ts` obtenga una referencia a un elemento
  del HTML (en este caso, el título de la tarjeta).
- **`effect`**: un bloque que se ejecuta automáticamente cuando cambia algo que
  observa. Aquí: "cuando aparezca el título, ponle el foco".
- **`tabindex="-1"`**: hace que un elemento que normalmente no recibe foco (un
  título) **pueda** recibirlo por programación, sin meterlo en el recorrido
  normal del tabulador.

### 3.6. El truco para que funcione con OnPush

Como la pantalla usa `OnPush`, los cambios de validación de los formularios no
disparan el redibujado por sí solos. Solución:

```ts
private readonly filtrosEstado = toSignal(this.filtros.events);
```

*Explicación:* `filtros.events` es un "flujo" que emite cada vez que el
formulario cambia (valor, validez, tocado...). `toSignal` lo convierte en un
**signal**. Los `computed` de error lo "leen", así que cada vez que el formulario
cambia, los errores se recalculan y la pantalla se actualiza. Es el puente entre
el formulario y el modo OnPush.

---

## 4. Comando `onboard` — Primer uso y valor inmediato

**Objetivo**: que el usuario llegue rápido a lo valioso. La filosofía: "los
estados vacíos son oportunidades de enseñar, no callejones sin salida".

**El problema**: la pantalla **hospitalaria** estaba vacía (solo decía "no hay
informes"), mientras que la **no hospitalaria** ya tenía el flujo completo de
elegir → filtrar → descargar.

**La decisión** (te pregunté y elegiste esta): **construir el flujo completo**
para hospitalario, replicando el de no hospitalario pero con el vocabulario
propio del ámbito.

**Qué se construyó** (pantalla `informes-h` completa):
- Catálogo de informes hospitalarios: Censo hospitalario, Egresos a domicilio,
  Reingresos hospitalarios.
- Servicios clínicos hospitalarios (Hospitalización domiciliaria, Cuidado
  paliativo, etc.).
- Filtro **"Sede hospitalaria"** en lugar de "Ciudad" (porque en hospitalario
  los pacientes vienen de un hospital de origen, no de una ciudad).
- Mismo rango de fechas con la misma validación.
- **Todo el endurecimiento del paso anterior incluido** (errores por campo,
  foco, `role="alert"`, etc.).

*Conceptos técnicos:*
- **Divulgación progresiva (progressive disclosure)**: no mostrar todo de golpe.
  Aquí, los filtros solo aparecen **después** de elegir un informe. Reduce la
  carga mental.
- **Generar el CSV**: cuando termina la descarga simulada, el código crea el
  archivo en el navegador. Usa un `Blob` (un objeto que representa un archivo en
  memoria) con un "BOM" al inicio (unos bytes invisibles que le dicen a Excel
  "esto está en UTF-8", para que las tildes y la ñ se vean bien), y libera la
  memoria después (`revokeObjectURL`) para no dejar basura.

**Extra**: aproveché para construir hospitalario **ya limpio**, sin los tells que
el audit marcó en no hospitalario (sin eyebrow, sin badge huérfano, sin estilo
inline). Así nació siendo el "gemelo bien portado".

---

## 5. Comando `layout` — Composición y consistencia

**Objetivo**: arreglar espaciado, jerarquía y, sobre todo, **consistencia** entre
las dos pantallas. En un producto operativo, "que dos pantallas hermanas se
comporten igual" es en sí mismo una ayuda para el usuario.

**Qué se arregló** (en `informes-nh`, para que igualara a `informes-h`):

1. **Se quitó el badge "1" huérfano.** En vez de añadir un "2" (que competiría
   con el icono de la tarjeta de filtros), se quitó el número. La secuencia
   "elegir → filtrar" ya se entiende sola porque los filtros aparecen solo
   después de elegir (divulgación progresiva). Numerar un solo paso se veía como
   un resto olvidado.

2. **Se añadió el mismo texto de orientación** bajo el selector ("Elige un
   informe para definir su periodo y filtros") que ya tenía hospitalario, para
   que ambas pantallas sean idénticas en estructura.

3. **Se reemplazó el estilo escrito a mano** por una clase del sistema:
   - Antes: `style="border-top: 1px solid var(--app-surface-200)"`
   - Ahora: `border-t border-[color:var(--app-surface-200)]`

   *Por qué importa:* el estilo "inline" (escrito directo en el elemento) se
   salta la convención del proyecto y es fácil de pasar por alto en un cambio
   futuro de la paleta. La versión con clase usa el mismo token (`--app-surface-200`)
   que el borde de las tarjetas, así que todo el módulo dibuja sus líneas con el
   mismo color.

4. **Se eliminó el estilo `.informes-nh__step`** del archivo `.scss` porque ya no
   se usaba (limpieza de código muerto).

**Resultado**: las dos pantallas quedaron **estructuralmente idénticas**,
diferenciándose solo en el contenido propio de cada ámbito (Ciudad vs Sede,
catálogos distintos).

---

## 6. Comando `typeset` — Tipografía

**Objetivo**: jerarquía y detalles de los textos.

**Hallazgo principal (honesto)**: el "eyebrow" en mayúsculas que el audit marcó
**ya no existía** en ninguna de las dos pantallas (se había resuelto en el camino:
hospitalario nació sin él y no hospitalario ya estaba sin él). No se inventó un
cambio que no hacía falta. La jerarquía de textos, revisada, ya estaba bien.

**Refinamientos que sí valían** (aplicados a ambas pantallas):

1. **`tabular-nums`** en el porcentaje de descarga.
   *Qué es:* hay fuentes donde cada dígito tiene un ancho distinto (el "1" es más
   angosto que el "8"). Como el porcentaje cambia rápido (0% → 100%), el número
   "bailaba" de ancho. `tabular-nums` hace que todos los dígitos ocupen lo mismo,
   así el número se queda quieto mientras sube.

2. **`text-pretty`** en los párrafos (subtítulos y descripciones).
   *Qué es:* evita "huérfanas", es decir, que la última línea de un párrafo quede
   con una sola palabra suelta. Reparte mejor las palabras.

3. **`text-balance`** en los títulos `h1`.
   *Qué es:* cuando un título ocupa dos líneas (en móvil), equilibra las líneas
   para que queden de largo parecido, en vez de una línea larga y una corta.

*Por qué a nivel de componente y no global:* estos ajustes se pusieron solo en
las clases de estas pantallas, sin tocar el archivo de tipografía compartido, para
no provocar cambios inesperados en toda la app.

*Qué NO se tocó:* la fuente (Inter). El producto ya la fija y es apropiada para
una herramienta operativa. Cambiarla sería una decisión de marca, no de pulido.

---

## 7. Comando `polish` — Pulido final

**Objetivo**: el barrido fino antes de entregar. La regla de oro de este comando:
*un build que compila no prueba que el diseño esté bien; hay que mirar el
resultado real.*

### 7.1. El arreglo real: una región que "hablaba demasiado"

**El problema (accesibilidad):** el bloque de descarga tenía
`role="status" aria-live="polite"` envolviendo el porcentaje. Como el porcentaje
cambia cada ~120 milisegundos, el lector de pantalla intentaba **anunciar el
progreso ~37 veces por descarga**. Insoportable.

*Concepto — "región live":* una zona marcada con `aria-live` es una zona cuyos
cambios el lector de pantalla **anuncia en voz alta automáticamente**. Es genial
para "se guardó tu cambio", pésimo para un número que cambia 8 veces por segundo.

**El arreglo:** se movió el `role="status"` al texto fijo "Descargando «X»…" (que
se anuncia **una sola vez** al iniciar). El porcentaje quedó como información
visual; quien use lector de pantalla puede consultarlo bajo demanda en la barra
de progreso (que tiene su propia etiqueta accesible). Resultado: se anuncia el
inicio una vez, sin la lluvia de anuncios.

### 7.2. Hallazgo del detector automático: decisión documentada

El skill tiene un "detector" que busca malas prácticas. Marcó `transition: width`
en la barra de progreso como "animación de propiedad de layout" (puede causar
lentitud).

**Por qué se mantuvo igualmente:** una barra de progreso es **el caso legítimo**
de animar el ancho: el relleno está posicionado de forma "absoluta" dentro de su
riel, así que cambiar su ancho **no mueve** al resto de la página (no hay
"layout thrash"). Cambiarlo por otra técnica (`scaleX`) implicaría pelear contra
cómo PrimeNG dibuja la barra, con un truco frágil. La guía del comando dice
explícitamente que el detector es **evidencia, no dogma**. Se mantuvo y se
**documentó con un comentario** en el código para que se lea como decisión
deliberada y nadie lo "arregle" mal después.

### 7.3. Cosas que se verificaron y YA estaban bien

- **Movimiento reducido (`prefers-reduced-motion`)**: algunas personas configuran
  su sistema para reducir animaciones (por mareo, etc.). El proyecto ya tiene una
  regla global que apaga animaciones y transiciones para esas personas. Eso ya
  cubre el spinner que gira y la barra de progreso. **No se agregó código
  redundante** (se verificó antes de tocar).
- **Consistencia de textos**: errores con punto, etiquetas sin punto, botones con
  formato "verbo + objeto" ("Descargar informe", "Limpiar filtros"), comillas
  tipográficas correctas. Todo coherente entre las dos pantallas.
- **Código limpio**: sin `console.log` (mensajes de depuración), sin `TODO`, sin
  código comentado muerto.

### 7.4. Lo que quedó pendiente (honesto)

El pulido se hizo **a nivel de código, sin verificación visual en navegador**
(se detuvo ese paso). No se confirmó con los ojos: el contraste real ya
renderizado, posibles desbordes en móvil con muchas selecciones, ni la
visibilidad del anillo de foco. Se razonó desde el código y los contrastes que el
sistema de tokens ya documenta, pero **no es lo mismo que verlo**.

**Para cerrar del todo:** levantar el servidor de desarrollo con `ng serve` y
revisar las dos rutas, sobre todo disparando los errores (pulsar "Descargar" con
campos vacíos) y mirando una descarga completa.

---

## 8. Tabla final: problema → solución → comando

| Problema del audit | Solución aplicada | Comando |
|--------------------|-------------------|---------|
| P1: el formulario solo bloqueaba el botón | Validar al enviar + mensajes por campo + foco al error | `harden` |
| P2: error de fechas mal conectado | Errores de rango reactivos con signals | `harden` |
| P2: estado vacío hospitalario sin valor | Se construyó el flujo completo (elegir→filtrar→descargar) | `onboard` |
| P2: "Paso 1" huérfano | Se quitó el badge; ambas pantallas iguales | `layout` |
| P3: estilo `style="..."` a mano | Reemplazado por clase con token del sistema | `layout` |
| P3: eyebrow en mayúsculas | Ya estaba resuelto; confirmado | `typeset` |
| (pulido) región que se anunciaba 37 veces | `role="status"` movido al texto fijo | `polish` |

---

## 9. Estado final

- **Las dos pantallas de informes** (hospitalario y no hospitalario) están
  funcionalmente completas, son estructuralmente idénticas (solo cambia el
  contenido de su ámbito) y están alineadas con el sistema de diseño.
- **Compila sin errores** en todos los pasos.
- **Único pendiente**: la verificación visual en navegador, que queda por hacer.

> Nota: estas pantallas son **solo de diseño/maqueta** (los catálogos son datos
> de ejemplo y la descarga genera un CSV local, sin servidor real detrás). El
> trabajo fue sobre la experiencia y la calidad del front, no sobre conectar un
> backend.
