import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { APP_CONFIG } from '../core/config/app-config';
import { HomePage } from './home.page';
import { KeyValueStorage } from '../core/storage/key-value.storage';
import { AppLanguageService } from '../core/i18n/app-language.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
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
});
