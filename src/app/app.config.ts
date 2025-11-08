import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from "primeng/config";
import Aura from '@primeuix/themes/aura';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ConfirmationService, MessageService} from 'primeng/api';
import {jwtInterceptor} from './core/interceptor/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          primary: 'sky',
          darkModeSelector: false,
        }
      },
      ripple: true
    }),
    ConfirmationService,
    MessageService
  ]
};
