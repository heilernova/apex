// cSpell:ignore sesion
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'iniciar-sesion', loadComponent: () => import('./pages/sing-in/sing-in').then(m => m.SingIn) },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then(m => m.Layout)
   }
];
