import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

/**
 * Interceptor funcional: adjunta el token `Bearer` a cada petición saliente
 * cuando hay sesión activa.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token;
  if (!token) {
    return next(req);
  }
  const autenticada = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(autenticada);
};
