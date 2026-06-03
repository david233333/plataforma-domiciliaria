/** Usuario autenticado. Modelo de sesión del framework (capa core). */
export interface UsuarioAutenticado {
  readonly id: string;
  readonly nombre: string;
  readonly correo: string;
  readonly roles: readonly string[];
}

/** Respuesta de un login exitoso. */
export interface Sesion {
  readonly token: string;
  readonly usuario: UsuarioAutenticado;
}
