import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthSession } from '../../auth';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = `${environment.api.baseUrl}${req.url}`;
  const nzMessage = inject(NzMessageService);
  const session = inject(AuthSession);
  const accessToken = session.getData()?.accessToken;
  req = req.clone({
    url,
    headers: accessToken ? req.headers.append('authorization', `Bearer ${accessToken}`) : undefined
  });
  return next(req).pipe(
    map(event => {
      // Aquí puedes manipular la respuesta si es necesario
      if (event instanceof HttpResponse) {

        if (event.status === 0){
          nzMessage.error('No se pudo conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
        }

        if (event.body && typeof event.body === 'object' && 'data' in event.body) {
          // Extraer el campo 'data' y devolverlo como el cuerpo de la respuesta
          return event.clone({ body: event.body.data ?? null });
        }
      }
      return event;
    }),
    catchError(err => {
      // Manejo global de errores
      let errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
      if (err.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.';
      }

      if (err.status >= 400 && err.status < 500) {
        errorMessage = err.error?.message || 'Ocurrió un error en la solicitud. Por favor, verifica los datos e inténtalo de nuevo.';
        nzMessage.error(errorMessage);
      }
      return throwError(() => new Error(errorMessage));
    })
  );
};
