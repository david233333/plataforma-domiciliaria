# i18n — convención y plan de migración

Decisión cerrada: **NO** se instala ninguna librería de i18n (ni Transloco, ni
ngx-translate, ni `@angular/localize`). Solo dejamos el terreno preparado.

## Qué está configurado hoy

- `provideI18n()` registra los datos de locale **es-CO** y provee
  `{ provide: LOCALE_ID, useValue: 'es-CO' }`. Con esto, los pipes `date`,
  `number`, `currency`, `percent` ya formatean en español de Colombia.

## Convención obligatoria de strings de UI

**Ningún string de UI hardcodeado y disperso por los templates/componentes.**
Cada slice de `presentation/` co-localiza sus etiquetas y catálogos en un archivo
de constantes con sufijo `*.labels.ts`, p. ej.:

```
presentation/hospitalario/novedades.labels.ts
```

Ese archivo exporta objetos/constantes con los textos y catálogos de la pantalla.
El componente importa de ahí; el template no inventa literales sueltos.

## Por qué así (plan de migración futura)

Cuando se decida adoptar una librería de i18n, la migración será **localizada**:
basta con transformar cada `*.labels.ts` en claves de traducción y cambiar el
punto de lectura, sin tener que rastrear strings esparcidos por todo el HTML.
