import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = `${environment.api.baseUrl}${req.url}`;
  const nzMessage = inject(NzMessageService);
  req = req.clone({
    url
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
    })
  );
};
