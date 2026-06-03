import { computed, Injectable, signal } from '@angular/core';
import { Sesion, UsuarioAutenticado } from './session.model';

const STORAGE_KEY = 'sp.auth.token';

/**
 * Servicio de autenticación app-wide (singleton). Mantiene la sesión en signals
 * y persiste el token en `localStorage` (estrategia elegida: sobrevive a cierres
 * de pestaña; cambiar a sessionStorage si se requiere expiración por sesión).
 *
 * NOTA: el `login` real contra el backend se implementará vía un caso de uso +
 * adaptador HTTP; aquí queda la mecánica de sesión y persistencia del token.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(this.leerTokenPersistido());
  private readonly _usuario = signal<UsuarioAutenticado | null>(null);

  readonly currentUser = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  /** Token actual para que el interceptor lo adjunte. */
  get token(): string | null {
    return this._token();
  }

  /** Establece la sesión tras un login exitoso y persiste el token. */
  iniciarSesion(sesion: Sesion): void {
    this._token.set(sesion.token);
    this._usuario.set(sesion.usuario);
    this.persistirToken(sesion.token);
  }

  /** Limpia la sesión (logout). */
  logout(): void {
    this._token.set(null);
    this._usuario.set(null);
    this.persistirToken(null);
  }

  /** ¿El usuario tiene el rol indicado? */
  tieneRol(rol: string): boolean {
    return this._usuario()?.roles.includes(rol) ?? false;
  }

  private leerTokenPersistido(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(STORAGE_KEY);
  }

  private persistirToken(token: string | null): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
