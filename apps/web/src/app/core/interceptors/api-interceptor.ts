import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = `${environment.api.baseUrl}${req.url}`;
  req = req.clone({
    url
  });
  return next(req);
};
