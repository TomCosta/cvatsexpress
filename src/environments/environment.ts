// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import type { AppConfig } from '../app/core/config/app-config';

export const environment: { production: boolean; appConfig: AppConfig } = {
  production: false,
  appConfig: {
    appName: 'CV ATS Express',
    defaultLanguage: 'pt-BR',
    freeResumeLimit: 1,
    featureFlags: {
      ai: false,
      ads: false,
      realBilling: false,
      premiumTemplates: false,
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
