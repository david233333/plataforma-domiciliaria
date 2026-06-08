import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SsoLoginService } from '../auth/sso-login.service';
import { ToasterService } from '../feedback/toaster.service';

/**
 * Interceptor funcional de errores HTTP. Traduce los códigos de estado más
 * comunes a un toast para el usuario y, ante un 401, dispara la redirección al
 * login corporativo de SURA (SSO).
 *
 * Por ahora solo se manejan 401, 403, 404 y 500; cualquier otro código (y un
 * fallo de red) se re-propaga para que cada adaptador lo traduzca a su error de
 * dominio. El error SIEMPRE se re-emite con `throwError` para no tragárselo.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const sso = inject(SsoLoginService);
  const toaster = inject(ToasterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Fallo de red / del cliente: no hubo respuesta del servidor (status 0).
      if (error.status === 0) {
        toaster.showError('No se pudo conectar con el servidor. Revisa tu conexión.');
        return throwError(() => error);
      }

      switch (error.status) {
        case 401: {
              toaster.showError('No autorizado. Inicia sesión.');
             // document.body.innerHTML = error.error;
            //  document.forms[0].submit();
          break;
        }
        case 403:
          toaster.showError('No tienes permisos para realizar esta acción.');
          break;
        case 404:
          toaster.showWarning('No se encontró el recurso solicitado.');
          break;
        case 500:
          toaster.showError('Ocurrió un error en el servidor. Inténtalo más tarde.');
          break;
        // Otros códigos se re-propagan sin toast (los traduce cada adaptador).
      }

      return throwError(() => error);
    }),
  );
};
