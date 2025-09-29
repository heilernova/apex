import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es-CO';

import { appRoutes } from './app.routes';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { apiInterceptor } from './core/interceptors';

// Registrar tanto 'es' como 'es-CO' para compatibilidad
registerLocaleData(es, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideAnimationsAsync(), // Requerido para ng-zorro-antd
    provideNzI18n(es_ES),
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor])),
    { provide: LOCALE_ID, useValue: 'es' }
  ],
};
