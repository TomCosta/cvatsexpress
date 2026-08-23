import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { AppLanguageService } from '../../core/i18n/app-language.service';
import { createEmptyResume, type Resume } from '../../core/models/resume.model';
import { ResumeRepository } from '../../core/repositories/resume.repository';
import { KeyValueStorage } from '../../core/storage/key-value.storage';
import { ResumePreviewPage } from './resume-preview.page';

describe('ResumePreviewPage localization', () => {
  let fixture: ComponentFixture<ResumePreviewPage>;

  beforeEach(async () => {
    const resume = createEmptyResume('resume-preview', 'en-US');

    await TestBed.configureTestingModule({
      imports: [ResumePreviewPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => resume.id },
            },
          },
        },
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
            list: async () => [resume],
            findById: async () => resume,
            save: async (value: Resume) => value,
            duplicate: async () => resume,
            delete: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    await TestBed.inject(AppLanguageService).setLanguage('es-419');
    fixture = TestBed.createComponent(ResumePreviewPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders app chrome in Spanish and document fallback in English', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.textContent).toContain('Revisión final');
    expect(page.textContent).toContain('Indica tu nombre en el editor');
    expect(page.textContent).toContain('Your name');
    expect(page.textContent).not.toContain('Tu nombre');
  });
});
