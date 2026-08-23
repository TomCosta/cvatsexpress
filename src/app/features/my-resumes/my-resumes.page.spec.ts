import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { AppLanguageService } from '../../core/i18n/app-language.service';
import { ResumeRepository } from '../../core/repositories/resume.repository';
import type { Resume } from '../../core/models/resume.model';
import { KeyValueStorage } from '../../core/storage/key-value.storage';
import { MyResumesPage } from './my-resumes.page';

describe('MyResumesPage localization', () => {
  let fixture: ComponentFixture<MyResumesPage>;
  let listError: Error | null;
  let saveError: Error | null;
  let saveGate: Promise<void> | null;
  let saveCount: number;
  let savedResumes: Resume[];

  beforeEach(async () => {
    listError = null;
    saveError = null;
    saveGate = null;
    saveCount = 0;
    savedResumes = [];
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
            list: async () => {
              if (listError) {
                throw listError;
              }
              return savedResumes;
            },
            findById: async () => null,
            save: async (resume: Resume) => {
              saveCount += 1;
              if (saveGate) {
                await saveGate;
              }
              if (saveError) {
                throw saveError;
              }
              savedResumes = [...savedResumes, resume];
              return resume;
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

  it('shows the saved resume when the editor could not be opened', async () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(false);
    const createButton = fixture.nativeElement.querySelector(
      '.empty-state ion-button',
    ) as HTMLElement;

    createButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(saveCount).toBe(1);
    expect(fixture.nativeElement.textContent).toContain(
      'El currículum se ha creado, pero no se ha podido abrir el editor.',
    );
    expect(fixture.nativeElement.textContent).toContain('Mi currículum');
  });

  it('keeps the empty library usable when creation fails', async () => {
    saveError = new Error('storage unavailable');
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    const createButton = fixture.nativeElement.querySelector(
      '.empty-state ion-button',
    ) as HTMLElement;

    createButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'No se ha podido crear el currículum. Inténtalo de nuevo.',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Crea tu primer currículum',
    );
  });

  it('preserves the read error when opening and reloading both fail', async () => {
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(false);
    listError = new Error('read unavailable');
    const createButton = fixture.nativeElement.querySelector(
      '.empty-state ion-button',
    ) as HTMLElement;

    createButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'No se han podido leer los currículums de este dispositivo.',
    );
    expect(fixture.nativeElement.textContent).not.toContain(
      'Ábrelo en la lista siguiente.',
    );
  });

  it('ignores repeated clicks while library creation is pending', async () => {
    let releaseSave = (): void => undefined;
    saveGate = new Promise<void>((resolve) => {
      releaseSave = resolve;
    });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(
      true,
    );
    const createButton = fixture.nativeElement.querySelector(
      '.empty-state ion-button',
    ) as HTMLElement;

    createButton.click();
    createButton.click();
    await Promise.resolve();

    expect(saveCount).toBe(1);
    releaseSave();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('does not redirect after leaving the library during a pending save', async () => {
    let releaseSave = (): void => undefined;
    saveGate = new Promise<void>((resolve) => {
      releaseSave = resolve;
    });
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    const createButton = fixture.nativeElement.querySelector(
      '.empty-state ion-button',
    ) as HTMLElement;

    createButton.click();
    fixture.componentInstance.ionViewWillLeave();
    releaseSave();
    await fixture.whenStable();

    expect(saveCount).toBe(1);
    expect(navigate).not.toHaveBeenCalled();
  });
});
