import { bootstrapApplication } from '@angular/platform-browser';
import { inject, provideAppInitializer } from '@angular/core';
import { RouteReuseStrategy, TitleStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { APP_CONFIG } from './app/core/config/app-config';
import { LocalResumeRepository } from './app/core/repositories/local-resume.repository';
import { ResumeRepository } from './app/core/repositories/resume.repository';
import { KeyValueStorage } from './app/core/storage/key-value.storage';
import { PreferencesStorage } from './app/core/storage/preferences.storage';
import { AppLanguageService } from './app/core/i18n/app-language.service';
import { LocalizedTitleStrategy } from './app/core/i18n/localized-title.strategy';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_CONFIG, useValue: environment.appConfig },
    { provide: KeyValueStorage, useClass: PreferencesStorage },
    { provide: ResumeRepository, useClass: LocalResumeRepository },
    { provide: TitleStrategy, useClass: LocalizedTitleStrategy },
    provideAppInitializer(() => inject(AppLanguageService).initialize()),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
