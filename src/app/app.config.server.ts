import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideClientHydration(),
    // Override toastr config for SSR - disable all toasts on server
    provideToastr({
      timeOut: 0,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: false,
      progressBar: false,
      disableTimeOut: true,
      tapToDismiss: false,
      newestOnTop: false,
      maxOpened: 0
    })
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
