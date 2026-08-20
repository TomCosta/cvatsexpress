import { InjectionToken } from '@angular/core';

export interface FeatureFlags {
  readonly ai: boolean;
  readonly ads: boolean;
  readonly realBilling: boolean;
  readonly premiumTemplates: boolean;
}

export interface AppConfig {
  readonly appName: string;
  readonly defaultLanguage: 'pt-BR' | 'en-US' | 'es-ES' | 'es-419';
  readonly freeResumeLimit: number;
  readonly featureFlags: FeatureFlags;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
