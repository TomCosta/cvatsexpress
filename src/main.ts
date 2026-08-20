import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { APP_CONFIG } from './app/core/config/app-config';
import { LocalResumeRepository } from './app/core/repositories/local-resume.repository';
import { ResumeRepository } from './app/core/repositories/resume.repository';
import { KeyValueStorage } from './app/core/storage/key-value.storage';
import { PreferencesStorage } from './app/core/storage/preferences.storage';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_CONFIG, useValue: environment.appConfig },
    { provide: KeyValueStorage, useClass: PreferencesStorage },
    { provide: ResumeRepository, useClass: LocalResumeRepository },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
