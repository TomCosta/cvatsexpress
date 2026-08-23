import { TestBed } from '@angular/core/testing';

import { APP_CONFIG } from '../config/app-config';
import { AppLanguageService } from '../i18n/app-language.service';
import type { Resume } from '../models/resume.model';
import { ResumeRepository } from '../repositories/resume.repository';
import { KeyValueStorage } from '../storage/key-value.storage';
import { CreateResumeService } from './create-resume.service';

describe('CreateResumeService', () => {
  let savedResume: Resume | null;

  beforeEach(() => {
    savedResume = null;
    TestBed.configureTestingModule({
      providers: [
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
        {
          provide: ResumeRepository,
          useValue: {
            list: async () => [],
            findById: async () => null,
            save: async (resume: Resume) => {
              savedResume = resume;
              return resume;
            },
            duplicate: async () => {
              throw new Error('not used');
            },
            delete: async () => undefined,
          },
        },
      ],
    });
  });

  it('persists a new resume using the current app language', async () => {
    await TestBed.inject(AppLanguageService).setLanguage('es-419');

    const created = await TestBed.inject(CreateResumeService).create();

    expect(savedResume).toBe(created);
    expect(created.id).toBeTruthy();
    expect(created.language).toBe('es-419');
    expect(created.title).toBe('Mi currículum');
  });
});
