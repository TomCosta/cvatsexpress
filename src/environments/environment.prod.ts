import type { AppConfig } from '../app/core/config/app-config';

export const environment: { production: boolean; appConfig: AppConfig } = {
  production: true,
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
