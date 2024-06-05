import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaModule } from 'ng-recaptcha';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(),provideHttpClient(), importProvidersFrom(RecaptchaModule), {provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcsQfEpAAAAAClCL6wPf_aZLR6Wy8RT-qcN95Ua'}]
};
