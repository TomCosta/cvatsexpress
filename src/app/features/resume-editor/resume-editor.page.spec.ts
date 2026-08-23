import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { AppLanguageService } from '../../core/i18n/app-language.service';
import { createEmptyResume, type Resume } from '../../core/models/resume.model';
import { ResumeRepository } from '../../core/repositories/resume.repository';
import { KeyValueStorage } from '../../core/storage/key-value.storage';
import { ResumeEditorPage } from './resume-editor.page';

describe('ResumeEditorPage localization', () => {
  let routeId: string | null;
  let savedResume: Resume | null;
  let existingResume: Resume;

  beforeEach(async () => {
    routeId = 'resume-existing';
    savedResume = null;
    existingResume = createEmptyResume(routeId, 'pt-BR');

    await TestBed.configureTestingModule({
      imports: [ResumeEditorPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => routeId,
              },
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
            list: async () => [],
            findById: async () => existingResume,
            save: async (resume: Resume) => {
              savedResume = resume;
              return resume;
            },
            duplicate: async () => existingResume,
            delete: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    await TestBed.inject(AppLanguageService).setLanguage('es-ES');
  });

  it('renders Spanish UI without changing an existing resume language', async () => {
    const fixture = await createFixture();
    const page: HTMLElement = fixture.nativeElement;
    const languageSelect = page.querySelector('ion-select') as
      | (HTMLElement & { value?: string })
      | null;

    expect(page.textContent).toContain('Cuenta tu trayectoria con claridad.');
    expect(languageSelect?.value).toBe('pt-BR');
  });

  it('creates a new resume with the current UI language and title', async () => {
    routeId = null;
    await createFixture();

    expect(savedResume?.language).toBe('es-ES');
    expect(savedResume?.title).toBe('Mi currículum');
  });

  async function createFixture(): Promise<ComponentFixture<ResumeEditorPage>> {
    const fixture = TestBed.createComponent(ResumeEditorPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }
});
