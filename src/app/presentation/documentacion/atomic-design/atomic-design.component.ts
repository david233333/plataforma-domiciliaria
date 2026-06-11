import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página de documentación de ATOMIC DESIGN. Explica, en lenguaje sencillo, qué es
 * un átomo / molécula / organismo, cuáles tenemos en `shared/ui`, y descompone la
 * pantalla de Informes pieza por pieza para que se vea QUÉ compone cada cosa.
 *
 * Convención (igual que `arquitectura-estilos`): los snippets y el árbol de
 * composición viven como strings en `code` —no en la plantilla— porque en los
 * templates de Angular los caracteres `<`, `@`, `{` y `{{ }}` tienen significado
 * especial y romperían el parser. Se renderizan con interpolación segura.
 */
@Component({
  selector: 'app-atomic-design',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-app section animate-fade-in">
      <!-- ============================ HEADER ============================ -->
      <header class="mb-10">
        <p class="text-overline">Documentación interna</p>
        <h1 class="text-display-md mt-2">Atomic Design</h1>
        <p class="text-body-lg mt-3" style="color: var(--app-text-secondary); max-width: 70ch">
          Cómo está organizada la interfaz por piezas: qué es un átomo, una
          molécula y un organismo, cuáles tenemos en el proyecto, y cómo se
          combinan. Al final desarmamos la pantalla de <strong>Informes</strong>
          para ver, parte por parte, qué la compone.
        </p>
      </header>

      <!-- ============================ ÍNDICE ============================ -->
      <nav class="card doc-toc mb-12" aria-label="Índice">
        <p class="text-label-lg mb-3">Contenido</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          <a href="#que-es">1. ¿Qué es Atomic Design?</a>
          <a href="#atomos">2. Átomos (los que tenemos)</a>
          <a href="#moleculas">3. Moléculas (las que tenemos)</a>
          <a href="#organismos">4. Organismos (los que tenemos)</a>
          <a href="#plantilla-paginas">5. Plantilla y páginas</a>
          <a href="#ejemplo">6. Ejemplo: Informes, pieza por pieza</a>
          <a href="#reglas">7. Reglas de composición</a>
        </div>
      </nav>

      <!-- ============================ 1. QUÉ ES ============================ -->
      <section id="que-es" class="mb-14">
        <h2 class="text-heading-xl mb-4">1. ¿Qué es Atomic Design?</h2>
        <p class="text-body-md mb-4" style="color: var(--app-text-secondary)">
          Es una forma de construir interfaces partiendo de
          <strong>piezas pequeñas</strong> que se combinan en piezas más grandes.
          La idea (de Brad Frost) toma prestados los nombres de la química: los
          <strong>átomos</strong> se unen para formar <strong>moléculas</strong>,
          las moléculas forman <strong>organismos</strong>, y con esos se arman las
          <strong>páginas</strong>.
        </p>

        <div class="doc-callout doc-callout--tip mb-6">
          <i class="pi pi-lightbulb"></i>
          <div>
            <strong>Analogía:</strong> piensa en LEGO. Un bloque suelto es un
            átomo. Dos bloques unidos (una rueda + un eje) son una molécula. Varias
            moléculas forman una sección entera del set (un organismo). Y el modelo
            completo armado es la página.
          </div>
        </div>

        <p class="text-body-md mb-4" style="color: var(--app-text-secondary)">
          Lo importante: la dependencia <strong>siempre va hacia abajo</strong>. Un
          átomo no conoce a una molécula; una molécula no conoce a un organismo. Así
          las piezas pequeñas son reutilizables en cualquier lugar.
        </p>

        <div class="card !p-0 overflow-hidden mb-2">
          <table class="doc-table">
            <thead>
              <tr>
                <th>Nivel</th>
                <th>Qué es (en simple)</th>
                <th>Dónde vive en el proyecto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="doc-lvl">Átomo</span></td>
                <td>La pieza más pequeña que ya no se divide: un botón, un icono, un badge.</td>
                <td><code class="doc-inline">shared/ui/atoms</code></td>
              </tr>
              <tr>
                <td><span class="doc-lvl">Molécula</span></td>
                <td>Dos o más átomos unidos con un propósito: un campo de formulario (label + control + error).</td>
                <td><code class="doc-inline">shared/ui/molecules</code></td>
              </tr>
              <tr>
                <td><span class="doc-lvl">Organismo</span></td>
                <td>Una sección con identidad propia, hecha de moléculas y átomos: una tarjeta de filtros, una tabla de resultados.</td>
                <td><code class="doc-inline">shared/ui/organisms</code></td>
              </tr>
              <tr>
                <td><span class="doc-lvl">Plantilla</span></td>
                <td>El esqueleto de la app: dónde va el header, el menú y el contenido. Sin datos reales.</td>
                <td><code class="doc-inline">core/layout</code></td>
              </tr>
              <tr>
                <td><span class="doc-lvl">Página</span></td>
                <td>La plantilla rellena con datos y lógica reales (la pantalla "inteligente" o <em>smart</em>).</td>
                <td><code class="doc-inline">presentation/**</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================ 2. ÁTOMOS ============================ -->
      <section id="atomos" class="mb-14">
        <h2 class="text-heading-xl mb-4">2. Átomos <span class="doc-lvl">shared/ui/atoms</span></h2>
        <p class="text-body-md mb-5" style="color: var(--app-text-secondary)">
          Piezas mínimas, sin partes. No componen a otros componentes (son "hojas").
          Varios envuelven un control de PrimeNG para darle una
          <strong>API propia y estable</strong> al sistema de diseño.
        </p>

        <div class="card !p-0 overflow-hidden">
          <table class="doc-table">
            <thead>
              <tr><th>Átomo</th><th>Selector</th><th>Qué hace</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Botón</td>
                <td><code class="doc-inline">app-button</code></td>
                <td>Envuelve <code class="doc-inline">p-button</code> con una API propia (severity, variant, size). Si cambia PrimeNG, solo se toca este átomo.</td>
              </tr>
              <tr>
                <td>Icono</td>
                <td><code class="doc-inline">app-icon</code></td>
                <td>El <code class="doc-inline">&lt;i&gt;</code> de PrimeIcons con la accesibilidad centralizada (decorativo → <code class="doc-inline">aria-hidden</code>).</td>
              </tr>
              <tr>
                <td>Badge de estado</td>
                <td><code class="doc-inline">app-status-badge</code></td>
                <td>La píldora coloreada de estado ("Pendiente", "Gestionada") con su par de color ya verificado en contraste WCAG.</td>
              </tr>
              <tr>
                <td>Skeleton</td>
                <td><code class="doc-inline">app-skeleton</code></td>
                <td>El placeholder gris con brillo que se ve mientras cargan los datos.</td>
              </tr>
              <tr>
                <td>Error de campo</td>
                <td><code class="doc-inline">app-field-error</code></td>
                <td>El mensaje de error de un campo, con <code class="doc-inline">role="alert"</code> para que lo anuncie el lector de pantalla.</td>
              </tr>
              <tr>
                <td>Ayuda de campo</td>
                <td><code class="doc-inline">app-field-hint</code></td>
                <td>El texto de ayuda que aparece bajo un campo cuando no hay error.</td>
              </tr>
              <tr>
                <td>Etiqueta de campo</td>
                <td><code class="doc-inline">app-field-label</code></td>
                <td>La etiqueta de un campo. <em>Nota: hoy sin uso en producto</em> (el <code class="doc-inline">form-field</code> usa un <code class="doc-inline">&lt;label&gt;</code> nativo por el FloatLabel).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================ 3. MOLÉCULAS ============================ -->
      <section id="moleculas" class="mb-14">
        <h2 class="text-heading-xl mb-4">3. Moléculas <span class="doc-lvl">shared/ui/molecules</span></h2>
        <p class="text-body-md mb-5" style="color: var(--app-text-secondary)">
          Combinan átomos (y a veces otras moléculas) en una pieza con un propósito
          concreto. Siguen siendo <strong>tontas</strong>: reciben datos por
          <code class="doc-inline">input()</code>, proyectan contenido y avisan con
          <code class="doc-inline">output()</code>; no conocen el dominio.
        </p>

        <div class="card !p-0 overflow-hidden">
          <table class="doc-table">
            <thead>
              <tr><th>Molécula</th><th>Selector</th><th>Qué compone</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Campo de formulario</td>
                <td><code class="doc-inline">app-form-field</code></td>
                <td>Label flotante + el control proyectado + <code class="doc-inline">app-field-error</code> / <code class="doc-inline">app-field-hint</code>.</td>
              </tr>
              <tr>
                <td>Cabecera de página</td>
                <td><code class="doc-inline">app-page-header</code></td>
                <td>Título <code class="doc-inline">&lt;h1&gt;</code> + overline + descripción + <code class="doc-inline">app-feature-icon</code> opcional.</td>
              </tr>
              <tr>
                <td>Icono destacado</td>
                <td><code class="doc-inline">app-feature-icon</code></td>
                <td>Un icono dentro de un recuadro de color. Compone el átomo <code class="doc-inline">app-icon</code>.</td>
              </tr>
              <tr>
                <td>Estado vacío</td>
                <td><code class="doc-inline">app-empty-state</code></td>
                <td>Icono grande + título + texto para "no hay resultados". Compone <code class="doc-inline">app-icon</code>.</td>
              </tr>
              <tr>
                <td>Acciones de formulario</td>
                <td><code class="doc-inline">app-form-actions</code></td>
                <td>Agrupa y alinea los botones del pie de un formulario (recibe <code class="doc-inline">app-button</code> por proyección).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============================ 4. ORGANISMOS ============================ -->
      <section id="organismos" class="mb-14">
        <h2 class="text-heading-xl mb-4">4. Organismos <span class="doc-lvl">shared/ui/organisms</span></h2>
        <p class="text-body-md mb-5" style="color: var(--app-text-secondary)">
          Secciones completas. La clave de los nuestros: son
          <strong>armazones con huecos</strong> (<code class="doc-inline">&lt;ng-content&gt;</code>).
          No saben qué filtros o columnas llevan; cada página proyecta los suyos.
          Por eso Solicitudes y Novedades comparten el mismo esqueleto y solo
          cambian los datos.
        </p>

        <div class="card !p-0 overflow-hidden">
          <table class="doc-table">
            <thead>
              <tr><th>Organismo</th><th>Selector</th><th>Qué resuelve</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Tarjeta de filtros</td>
                <td><code class="doc-inline">app-filter-card</code></td>
                <td>El panel colapsable de filtros. La página proyecta SUS campos y SUS botones dentro.</td>
              </tr>
              <tr>
                <td>Tarjeta de resultados</td>
                <td><code class="doc-inline">app-data-table-card</code></td>
                <td>Resuelve los 3 estados (cargando / vacío / con datos). Compone <code class="doc-inline">app-skeleton</code> y <code class="doc-inline">app-empty-state</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ==================== 5. PLANTILLA Y PÁGINAS ==================== -->
      <section id="plantilla-paginas" class="mb-14">
        <h2 class="text-heading-xl mb-4">5. Plantilla y páginas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card--outlined">
            <span class="doc-lvl mb-3" style="display:inline-block">Plantilla</span>
            <h3 class="text-heading-sm mt-1 mb-1"><code class="doc-inline">app-shell</code></h3>
            <p class="text-body-sm" style="color: var(--app-text-secondary)">
              El esqueleto fijo: header, menú lateral (drawer) y el
              <code class="doc-inline">&lt;router-outlet&gt;</code> donde entra cada
              página. Vive en <code class="doc-inline">core/layout</code> porque es
              único en toda la app.
            </p>
          </div>
          <div class="card--outlined">
            <span class="doc-lvl mb-3" style="display:inline-block">Páginas (smart)</span>
            <h3 class="text-heading-sm mt-1 mb-1"><code class="doc-inline">presentation/**</code></h3>
            <p class="text-body-sm" style="color: var(--app-text-secondary)">
              Las pantallas reales: <code class="doc-inline">app-informes</code>,
              <code class="doc-inline">app-solicitudes</code>,
              <code class="doc-inline">app-gestionar-novedades</code>,
              <code class="doc-inline">app-inicio</code>. Aquí viven los datos, los
              formularios y los casos de uso.
            </p>
          </div>
        </div>
      </section>

      <!-- ============================ 6. EJEMPLO ============================ -->
      <section id="ejemplo" class="mb-14">
        <h2 class="text-heading-xl mb-4">6. Ejemplo: Informes, pieza por pieza</h2>
        <p class="text-body-md mb-4" style="color: var(--app-text-secondary)">
          La pantalla <code class="doc-inline">app-informes</code> es una
          <strong>página</strong> (smart): es dueña del formulario, la validación
          y la descarga. Para pintarse no inventa nada: combina piezas del sistema
          de diseño. Así se descompone:
        </p>

        <div class="card--outlined mb-6">
          <pre class="doc-code"><code>{{ code.arbol }}</code></pre>
        </div>

        <p class="text-body-md mb-3" style="color: var(--app-text-secondary)">
          Lo mismo, mirando <strong>lo que ves en la pantalla</strong> y a qué
          nivel pertenece cada parte:
        </p>

        <div class="card !p-0 overflow-hidden mb-6">
          <table class="doc-table">
            <thead>
              <tr><th>En la pantalla</th><th>Nivel</th><th>Pieza</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Título "Informes hospitalarios" + descripción</td>
                <td><span class="doc-lvl">Molécula</span></td>
                <td><code class="doc-inline">app-page-header</code></td>
              </tr>
              <tr>
                <td>Toggle Hospitalario / No hospitalario</td>
                <td>PrimeNG</td>
                <td><code class="doc-inline">p-selectButton</code> (control sin envolver)</td>
              </tr>
              <tr>
                <td>Selector "Informe"</td>
                <td><span class="doc-lvl">Molécula</span></td>
                <td><code class="doc-inline">app-form-field</code> → <code class="doc-inline">p-select</code></td>
              </tr>
              <tr>
                <td>Resumen del informe (icono + nombre)</td>
                <td><span class="doc-lvl">Molécula</span></td>
                <td><code class="doc-inline">app-feature-icon</code> → <code class="doc-inline">app-icon</code></td>
              </tr>
              <tr>
                <td>Campos: servicios, dimensión, 2 fechas</td>
                <td><span class="doc-lvl">Molécula ×4</span></td>
                <td><code class="doc-inline">app-form-field</code> → <code class="doc-inline">p-multiselect</code> / <code class="doc-inline">p-datepicker</code></td>
              </tr>
              <tr>
                <td>"(obligatorio)", ayuda y mensajes de error</td>
                <td><span class="doc-lvl">Átomo</span></td>
                <td><code class="doc-inline">app-field-error</code> / <code class="doc-inline">app-field-hint</code> (dentro del form-field)</td>
              </tr>
              <tr>
                <td>Botones Limpiar / Descargar / Cancelar</td>
                <td><span class="doc-lvl">Átomo</span></td>
                <td><code class="doc-inline">app-button</code>, agrupados por <code class="doc-inline">app-form-actions</code></td>
              </tr>
              <tr>
                <td>Barra de progreso de la descarga</td>
                <td>PrimeNG</td>
                <td><code class="doc-inline">p-progressbar</code></td>
              </tr>
              <tr>
                <td>La tarjeta blanca que envuelve los filtros</td>
                <td>Patrón CSS</td>
                <td><code class="doc-inline">.card</code> (no es componente)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-body-md mb-2" style="color: var(--app-text-secondary)">
          Una molécula en su sitio: el selector de informe es un
          <code class="doc-inline">app-form-field</code> que <strong>envuelve</strong>
          un <code class="doc-inline">p-select</code> proyectado:
        </p>
        <pre class="doc-code mb-6"><code>{{ code.formField }}</code></pre>

        <p class="text-body-md mb-2" style="color: var(--app-text-secondary)">
          Y el pie del formulario: la molécula <code class="doc-inline">app-form-actions</code>
          solo alinea; los átomos <code class="doc-inline">app-button</code> son los botones:
        </p>
        <pre class="doc-code mb-6"><code>{{ code.actions }}</code></pre>

        <div class="doc-callout">
          <i class="pi pi-info-circle"></i>
          <div>
            Fíjate dónde <strong>termina</strong> el Atomic Design: los controles
            complejos (<code class="doc-inline">p-select</code>,
            <code class="doc-inline">p-datepicker</code>,
            <code class="doc-inline">p-progressbar</code>) son PrimeNG crudo, y la
            tarjeta es el patrón CSS <code class="doc-inline">.card</code>. El sistema
            no reinventa lo que la librería o los patrones ya resuelven.
          </div>
        </div>
      </section>

      <!-- ============================ 7. REGLAS ============================ -->
      <section id="reglas" class="mb-6">
        <h2 class="text-heading-xl mb-4">7. Reglas de composición</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card--outlined">
            <h3 class="text-label-lg mb-3" style="color: var(--app-success-dark)">
              <i class="pi pi-check mr-1"></i> Haz
            </h3>
            <ul class="flex flex-col gap-2" role="list">
              <li class="text-body-sm">Compón hacia abajo: la molécula usa átomos; el organismo usa moléculas; la página usa de todo.</li>
              <li class="text-body-sm">Mantén <code class="doc-inline">shared/ui</code> <strong>tonto</strong>: inputs, outputs y proyección, sin dominio.</li>
              <li class="text-body-sm">Pon la lógica (datos, formularios, casos de uso) en la <strong>página</strong> smart.</li>
              <li class="text-body-sm">Envuelve PrimeNG en un átomo cuando quieras una API estable (como <code class="doc-inline">app-button</code>).</li>
            </ul>
          </div>
          <div class="card--outlined">
            <h3 class="text-label-lg mb-3" style="color: var(--app-error-dark)">
              <i class="pi pi-times mr-1"></i> Evita
            </h3>
            <ul class="flex flex-col gap-2" role="list">
              <li class="text-body-sm">Que un átomo importe una molécula u organismo (la dependencia nunca sube).</li>
              <li class="text-body-sm">Meter reglas de negocio dentro de <code class="doc-inline">shared/ui</code>.</li>
              <li class="text-body-sm">Recrear un componente que ya existe (revisa <code class="doc-inline">shared/ui</code> antes).</li>
              <li class="text-body-sm">Forzar un organismo donde no encaja: Informes NO usa <code class="doc-inline">data-table-card</code> porque no es una tabla.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    /* Enlaces del índice. */
    .doc-toc a {
      display: block;
      padding: var(--app-space-1) var(--app-space-2);
      border-radius: var(--app-radius-sm);
      color: var(--app-primary-700);
      text-decoration: none;
      font-size: var(--app-size-sm);
    }
    .doc-toc a:hover {
      background: var(--app-surface-50);
      text-decoration: underline;
    }

    /* Código en línea. */
    .doc-inline {
      font-family: var(--app-font-mono);
      font-size: 0.85em;
      background: var(--app-surface-100);
      border: 1px solid var(--app-surface-200);
      border-radius: var(--app-radius-sm);
      padding: 0.1rem 0.35rem;
      color: var(--app-text-primary);
    }

    /* Bloque de código / árbol de composición. */
    .doc-code {
      font-family: var(--app-font-mono);
      font-size: var(--app-size-sm);
      line-height: var(--app-leading-normal);
      background: var(--app-surface-50);
      border: 1px solid var(--app-surface-200);
      border-radius: var(--app-radius-md);
      padding: var(--app-space-4);
      overflow-x: auto;
      white-space: pre;
      color: var(--app-text-primary);
    }
    .doc-code code {
      font-family: inherit;
    }

    /* Tabla de documentación. */
    .doc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--app-size-sm);
    }
    .doc-table th,
    .doc-table td {
      text-align: left;
      padding: var(--app-space-3) var(--app-space-4);
      border-bottom: 1px solid var(--app-surface-200);
      vertical-align: top;
    }
    .doc-table th {
      background: var(--app-surface-50);
      color: var(--app-text-secondary);
      font-weight: var(--app-weight-semibold);
    }
    .doc-table td {
      color: var(--app-text-secondary);
    }
    .doc-table tr:last-child td {
      border-bottom: 0;
    }

    /* Etiqueta de nivel (átomo / molécula / …). Es un rótulo, no un estado:
       un único color de marca para todos. */
    .doc-lvl {
      display: inline-block;
      font-size: var(--app-size-xs);
      font-weight: var(--app-weight-semibold);
      letter-spacing: var(--app-tracking-wide);
      padding: 0.1rem 0.5rem;
      border-radius: var(--app-radius-full);
      background: var(--app-primary-50);
      color: var(--app-primary-700);
      white-space: nowrap;
    }

    /* Llamados (callouts). */
    .doc-callout {
      display: flex;
      gap: var(--app-space-3);
      align-items: flex-start;
      padding: var(--app-space-4);
      border-radius: var(--app-radius-md);
      background: var(--app-primary-50);
      color: var(--app-text-secondary);
    }
    .doc-callout i {
      color: var(--app-primary-600);
      font-size: 1.1rem;
      margin-top: 0.1rem;
    }
    .doc-callout--tip {
      background: var(--app-success-light);
    }
    .doc-callout--tip i {
      color: var(--app-success-dark);
    }
  `,
})
export class AtomicDesignComponent {
  /**
   * Árbol de composición y snippets de la pantalla de Informes. Van como strings
   * (no en el HTML) para que Angular no interprete `<`, `@` ni `{{ }}`.
   */
  protected readonly code = {
    arbol: `PÁGINA  ·  app-informes          (smart: datos, formulario, validación, descarga)
│
├─ MOLÉCULA   app-page-header      → título + descripción de la pantalla
│
├─ PrimeNG    p-selectButton       → toggle de ámbito (control SIN envolver)
│
├─ MOLÉCULA   app-form-field       → selector de informe
│   ├─ PrimeNG   p-select          → control proyectado dentro de la molécula
│   ├─ ÁTOMO     app-field-hint    → texto de ayuda (interno del form-field)
│   └─ ÁTOMO     app-field-error   → mensaje de error (interno del form-field)
│
└─ PATRÓN .card  ·  <form>         → tarjeta de filtros (aparece al elegir informe)
    ├─ MOLÉCULA   app-feature-icon  → icono en recuadro de color
    │   └─ ÁTOMO  app-icon          → el <i> de PrimeIcons + accesibilidad
    ├─ MOLÉCULA   app-form-field ×4 → servicios, dimensión, fecha inicio, fecha fin
    │   └─ PrimeNG  p-multiselect / p-datepicker
    ├─ PATRÓN .field__error / .field__hint → mensaje del rango de fechas
    └─ MOLÉCULA   app-form-actions   → alinea los botones del pie
        ├─ ÁTOMO   app-button        → Limpiar · Descargar · Cancelar
        └─ PrimeNG p-progressbar     → barra de progreso (mientras descarga)`,

    formField: `<!-- MOLÉCULA: resuelve el label flotante + el slot de error/ayuda -->
<app-form-field
  label="Informe"
  controlId="informe"
  hint="Elige un informe para definir su periodo y filtros.">

  <!-- CONTROL PrimeNG crudo, PROYECTADO dentro de la molécula -->
  <p-select inputId="informe" [options]="config().informes" ... />
</app-form-field>`,

    actions: `<!-- MOLÉCULA form-actions: solo agrupa y alinea -->
<app-form-actions>
  <!-- ÁTOMO button: API propia del sistema de diseño sobre p-button -->
  <app-button label="Limpiar filtros" icon="refresh" variant="outlined" ... />
  <app-button label="Descargar informe" icon="download" type="submit" />
</app-form-actions>`,
  };
}
