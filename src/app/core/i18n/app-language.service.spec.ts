import { TestBed } from '@angular/core/testing';

import { APP_CONFIG, type AppConfig } from '../config/app-config';
import { KeyValueStorage } from '../storage/key-value.storage';
import { AppLanguageService } from './app-language.service';
import { detectAppLanguage, translate } from './app-translations';

const config: AppConfig = {
  appName: 'CV ATS Express',
  defaultLanguage: 'pt-BR',
  freeResumeLimit: 1,
  featureFlags: {
    ai: false,
    ads: false,
    realBilling: false,
    premiumTemplates: false,
  },
};

class TestStorage extends KeyValueStorage {
  value: string | null = null;
  fail = false;
  delayedValue = '';

  override async get(): Promise<string | null> {
    if (this.fail) {
      throw new Error('storage unavailable');
    }
    return this.value;
  }

  override async set(_key: string, value: string): Promise<void> {
    if (this.fail) {
      throw new Error('storage unavailable');
    }
    if (value === this.delayedValue) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    this.value = value;
  }

  override async remove(): Promise<void> {
    this.value = null;
  }
}

describe('runtime localization', () => {
  let storage: TestStorage;
  let service: AppLanguageService;

  beforeEach(() => {
    storage = new TestStorage();
    TestBed.configureTestingModule({
      providers: [
        AppLanguageService,
        { provide: KeyValueStorage, useValue: storage },
        { provide: APP_CONFIG, useValue: config },
      ],
    });
    service = TestBed.inject(AppLanguageService);
  });

  it('maps compatible system locales and keeps Spanish variants distinct', () => {
    expect(detectAppLanguage(['pt-PT'])).toBe('pt-BR');
    expect(detectAppLanguage(['en_GB'])).toBe('en-US');
    expect(detectAppLanguage(['es-ES'])).toBe('es-ES');
    expect(detectAppLanguage(['es-MX'])).toBe('es-419');
    expect(detectAppLanguage(['es'])).toBe('es-419');
    expect(detectAppLanguage(['fr-FR', 'en-US'])).toBe('en-US');
    expect(detectAppLanguage(['fr-FR'], 'en-US')).toBe('en-US');
  });

  it('uses and persists the system language on first launch', async () => {
    await service.initialize(['es-MX']);

    expect(service.language()).toBe('es-419');
    expect(storage.value).toBe('es-419');
    expect(document.documentElement.lang).toBe('es-419');
  });

  it('prefers a valid saved language and ignores a corrupt value', async () => {
    storage.value = 'en-US';
    await service.initialize(['pt-BR']);
    expect(service.language()).toBe('en-US');

    storage.value = 'invalid';
    await service.initialize(['es-ES']);
    expect(service.language()).toBe('es-ES');
    expect(storage.value).toBe('es-ES');
  });

  it('remains usable in memory when storage fails', async () => {
    storage.fail = true;
    await service.initialize(['en-US']);

    expect(service.language()).toBe('en-US');
    expect(await service.setLanguage('es-ES')).toBeFalse();
    expect(service.language()).toBe('es-ES');
  });

  it('serializes rapid changes so the last choice remains persisted', async () => {
    storage.delayedValue = 'en-US';

    await Promise.all([
      service.setLanguage('en-US'),
      service.setLanguage('es-419'),
    ]);

    expect(service.language()).toBe('es-419');
    expect(storage.value).toBe('es-419');
  });

  it('provides complete addressable catalogs for all four languages', () => {
    expect(translate('pt-BR', 'home.create')).toBe('Criar meu currículo');
    expect(translate('en-US', 'home.create')).toBe('Create my resume');
    expect(translate('es-ES', 'common.add')).toBe('Añadir');
    expect(translate('es-419', 'common.add')).toBe('Agregar');
  });
});
