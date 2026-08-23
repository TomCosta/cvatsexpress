import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { APP_CONFIG } from '../config/app-config';
import { KeyValueStorage } from '../storage/key-value.storage';
import { AppLanguageService } from './app-language.service';
import { LocalizedTitleStrategy } from './localized-title.strategy';

describe('LocalizedTitleStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TitleStrategy, useClass: LocalizedTitleStrategy },
        {
          provide: APP_CONFIG,
          useValue: {
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
        },
        {
          provide: KeyValueStorage,
          useValue: {
            get: async () => null,
            set: async () => undefined,
            remove: async () => undefined,
          },
        },
      ],
    });
  });

  it('updates the current route title when the language changes', async () => {
    const strategy = TestBed.inject(TitleStrategy);
    const title = TestBed.inject(Title);
    const i18n = TestBed.inject(AppLanguageService);
    const snapshot = {
      root: {
        data: {},
        children: [
          {
            data: { titleKey: 'route.resumes' },
            children: [],
          },
        ],
      },
    } as unknown as RouterStateSnapshot;

    strategy.updateTitle(snapshot);
    TestBed.flushEffects();
    expect(title.getTitle()).toBe('Meus currículos — CV ATS Express');

    await i18n.setLanguage('en-US');
    TestBed.flushEffects();
    expect(title.getTitle()).toBe('My resumes — CV ATS Express');
  });
});
