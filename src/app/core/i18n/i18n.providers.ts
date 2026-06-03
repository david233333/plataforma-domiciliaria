import { LOCALE_ID, Provider } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';

// Registra los datos de locale es-CO (formatos de fecha, número y moneda).
// Se ejecuta al importar este módulo, antes de que Angular resuelva LOCALE_ID.
registerLocaleData(localeEsCO);

/**
 * Provee el locale por defecto de la aplicación: español de Colombia.
 *
 * Esto NO es una librería de traducción (decisión cerrada: i18n solo queda
 * PREPARADO, sin instalar Transloco/ngx-translate/@angular/localize). Solo da
 * el formato correcto de fechas/números. La convención de strings de UI está
 * documentada en `core/i18n/README.md`.
 */
export function provideI18n(): Provider[] {
  return [{ provide: LOCALE_ID, useValue: 'es-CO' }];
}
