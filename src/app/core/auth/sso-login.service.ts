import { DOCUMENT, inject, Injectable } from '@angular/core';

/**
 * Redirección al login corporativo de SURA (SSO).
 *
 * Mecánica: ante un 401, el backend NO responde JSON sino el **HTML de un
 * formulario de autenticación** (patrón SAML/SSO con RelayState). Para que el
 * navegador navegue al IdP de SURA hay que renderizar ese HTML y auto-enviar su
 * formulario. Reemplaza el documento actual, así que es la ÚLTIMA acción del
 * flujo de error (después de esto la página ya no es la app).
 *
 * Buenas prácticas aplicadas:
 *  - Se accede al DOM por el token `DOCUMENT` inyectado (no el global `document`):
 *    es testeable y seguro en entornos sin DOM (SSR).
 *  - Responsabilidad única: solo sabe «pintar y enviar» el formulario del IdP.
 *
 * Seguridad: se asigna `innerHTML` con HTML que proviene EXCLUSIVAMENTE del
 * backend de confianza (la respuesta 401 del propio dominio). No es entrada de
 * usuario; es el contrato del SSO. Por eso se omite la sanitización de Angular
 * (que rompería el formulario del IdP).
 */
@Injectable({ providedIn: 'root' })
export class SsoLoginService {
  private readonly document = inject(DOCUMENT);

  /**
   * Renderiza el formulario de login del IdP y lo envía para redirigir a SURA.
   * @param htmlFormulario HTML devuelto por el backend en la respuesta 401.
   * @returns `true` si encontró y envió un formulario; `false` si no había uno
   *          (el llamador puede entonces aplicar un fallback).
   */
  redirigirALogin(htmlFormulario: string): boolean {
    this.document.body.innerHTML = htmlFormulario;
    const formulario = this.document.forms[0];
    if (!formulario) {
      return false;
    }
    formulario.submit();
    return true;
  }
}
