import { Injectable, inject, signal } from '@angular/core';

import { KeyValueStorage } from '../storage/key-value.storage';
import { APP_CONFIG } from '../config/app-config';
import {
  APP_LANGUAGES,
  type AppLanguage,
  type AppTranslationKey,
  detectAppLanguage,
  isAppLanguage,
  translate,
} from './app-translations';

const STORAGE_KEY = 'cv-ats-express.app-language.v1';

@Injectable({ providedIn: 'root' })
export class AppLanguageService {
  private readonly storage = inject(KeyValueStorage);
  private readonly appConfig = inject(APP_CONFIG);
  private readonly currentLanguage = signal<AppLanguage>('pt-BR');
  private persistenceQueue: Promise<void> = Promise.resolve();

  readonly language = this.currentLanguage.asReadonly();
  readonly options = APP_LANGUAGES;

  async initialize(systemLocales = this.systemLocales()): Promise<void> {
    let storedLanguage: string | null = null;

    try {
      storedLanguage = await this.storage.get(STORAGE_KEY);
    } catch {
      // A storage failure must not prevent the offline app from starting.
    }

    const language = isAppLanguage(storedLanguage)
      ? storedLanguage
      : detectAppLanguage(systemLocales, this.appConfig.defaultLanguage);

    this.apply(language);

    if (!isAppLanguage(storedLanguage)) {
      try {
        await this.storage.set(STORAGE_KEY, language);
      } catch {
        // Keep the selected language in memory for this session.
      }
    }
  }

  async setLanguage(language: AppLanguage): Promise<boolean> {
    this.apply(language);
    const result = this.persistenceQueue.then(async () => {
      try {
        await this.storage.set(STORAGE_KEY, language);
        return true;
      } catch {
        return false;
      }
    });
    this.persistenceQueue = result.then(() => undefined);
    return result;
  }

  t(
    key: AppTranslationKey,
    params?: Readonly<Record<string, string | number>>,
  ): string {
    return translate(this.currentLanguage(), key, params);
  }

  private apply(language: AppLanguage): void {
    this.currentLanguage.set(language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }

  private systemLocales(): readonly string[] {
    if (typeof navigator === 'undefined') {
      return [];
    }

    return navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
  }
}
