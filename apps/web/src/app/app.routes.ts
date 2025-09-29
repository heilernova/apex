import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'login', loadComponent: () => import('./pages/login-page/login-page').then((c) => c.LoginPage) },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((c) => c.Layout ),
  }
];
