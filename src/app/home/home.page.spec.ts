import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../core/config/app-config';
import { HomePage } from './home.page';
import { KeyValueStorage } from '../core/storage/key-value.storage';
import { AppLanguageService } from '../core/i18n/app-language.service';
import type { Resume } from '../core/models/resume.model';
import { ResumeRepository } from '../core/repositories/resume.repository';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let saveError: Error | null;
  let saveGate: Promise<void> | null;
  let saveCount: number;
  let savedResume: Resume | null;

  beforeEach(async () => {
    saveError = null;
    saveGate = null;
    saveCount = 0;
    savedResume = null;
    await TestBed.configureTestingModule({
      imports: [HomePage],
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
            save: async (resume: Resume) => {
              saveCount += 1;
              if (saveGate) {
                await saveGate;
              }
              if (saveError) {
                throw saveError;
              }
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
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('communicates the value proposition and offers the main actions', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.textContent).toContain('currículo profissional');
    expect(page.textContent).toContain('Funciona offline');
    expect(page.textContent).toContain('Criar meu currículo');
    expect(page.textContent).toContain('Meus currículos');
  });

  it('updates the Home immediately when the app language changes', async () => {
    await TestBed.inject(AppLanguageService).setLanguage('en-US');
    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;
    expect(page.textContent).toContain('A professional resume');
    expect(page.textContent).toContain('Create my resume');
    expect(document.documentElement.lang).toBe('en-US');
  });

  it('creates a resume before navigating to the editor', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const createButton = fixture.nativeElement.querySelector(
      '.actions ion-button',
    ) as HTMLElement;

    createButton.click();
    await fixture.whenStable();

    expect(savedResume).not.toBeNull();
    expect(navigate).toHaveBeenCalledWith([
      '/resume',
      savedResume?.id,
      'edit',
    ]);
  });

  it('stays on Home and shows an actionable error when creation fails', async () => {
    saveError = new Error('storage unavailable');
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate');
    const createButton = fixture.nativeElement.querySelector(
      '.actions ion-button',
    ) as HTMLElement;

    createButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'Não foi possível criar o currículo. Tente novamente.',
    );
  });

  it('retries opening the saved resume without creating a duplicate', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate');
    navigate.and.resolveTo(false);
    const createButton = fixture.nativeElement.querySelector(
      '.actions ion-button',
    ) as HTMLElement;

    createButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(saveCount).toBe(1);
    expect(fixture.nativeElement.textContent).toContain(
      'O currículo foi criado, mas não foi possível abrir o editor.',
    );
    expect(createButton.textContent).toContain('Abrir currículo');

    await TestBed.inject(AppLanguageService).setLanguage('en-US');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'The resume was created, but the editor could not be opened.',
    );

    navigate.and.resolveTo(true);
    createButton.click();
    await fixture.whenStable();

    expect(saveCount).toBe(1);
    expect(navigate).toHaveBeenCalledTimes(2);
  });

  it('ignores repeated clicks while creation is pending', async () => {
    let releaseSave = (): void => undefined;
    saveGate = new Promise<void>((resolve) => {
      releaseSave = resolve;
    });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(
      true,
    );
    const createButton = fixture.nativeElement.querySelector(
      '.actions ion-button',
    ) as HTMLElement;

    createButton.click();
    createButton.click();
    await Promise.resolve();

    expect(saveCount).toBe(1);
    releaseSave();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('does not redirect after the user leaves during a pending save', async () => {
    let releaseSave = (): void => undefined;
    saveGate = new Promise<void>((resolve) => {
      releaseSave = resolve;
    });
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    const createButton = fixture.nativeElement.querySelector(
      '.actions ion-button',
    ) as HTMLElement;

    createButton.click();
    component.ionViewWillLeave();
    releaseSave();
    await fixture.whenStable();

    expect(saveCount).toBe(1);
    expect(navigate).not.toHaveBeenCalled();
  });
});
