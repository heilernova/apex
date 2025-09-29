import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'login', loadComponent: () => import('./pages/login-page/login-page').then((c) => c.LoginPage) },
  { path: 'registrarse', loadComponent: () => import('./pages/register-login/register-login').then((c) => c.RegisterLogin) },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((c) => c.Layout ),
  }
];
