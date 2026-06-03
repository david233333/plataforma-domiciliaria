import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard funcional: exige sesión activa. Si no hay, redirige a /login
 * conservando la URL destino en `returnUrl`.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/**
 * Guard funcional parametrizable por rol. Uso en la ruta:
 *   canActivate: [authGuard, roleGuard('ADMIN')]
 */
export function roleGuard(...rolesPermitidos: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const autorizado = rolesPermitidos.some((rol) => auth.tieneRol(rol));
    return autorizado ? true : router.createUrlTree(['/']);
  };
}
