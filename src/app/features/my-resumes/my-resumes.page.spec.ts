import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { AppLanguageService } from '../../core/i18n/app-language.service';
import { ResumeRepository } from '../../core/repositories/resume.repository';
import { KeyValueStorage } from '../../core/storage/key-value.storage';
import { MyResumesPage } from './my-resumes.page';

describe('MyResumesPage localization', () => {
  let fixture: ComponentFixture<MyResumesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyResumesPage],
      providers: [
        provideRouter([]),
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
            save: async () => {
              throw new Error('not used');
            },
            duplicate: async () => {
              throw new Error('not used');
            },
            delete: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    await TestBed.inject(AppLanguageService).setLanguage('es-419');
    fixture = TestBed.createComponent(MyResumesPage);
    await fixture.componentInstance.ionViewWillEnter();
    fixture.detectChanges();
  });

  it('renders the empty library in Latin American Spanish', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.textContent).toContain('Tus currículums');
    expect(page.textContent).toContain('Crea tu primer currículum');
    expect(document.documentElement.lang).toBe('es-419');
  });
});
