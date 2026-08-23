import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config';
import { KeyValueStorage } from './core/storage/key-value.storage';
import { LocalResumeRepository } from './core/repositories/local-resume.repository';
import { ResumeRepository } from './core/repositories/resume.repository';
import { MyResumesPage } from './features/my-resumes/my-resumes.page';

class MemoryStorage extends KeyValueStorage {
  private readonly values = new Map<string, string>();

  override async get(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  override async set(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }

  override async remove(key: string): Promise<void> {
    this.values.delete(key);
  }
}

describe('app routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
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
        { provide: KeyValueStorage, useClass: MemoryStorage },
        { provide: ResumeRepository, useClass: LocalResumeRepository },
      ],
    });
  });

  it('redirects the root route and loads Home', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(TestBed.inject(Router).url).toBe('/home');
    expect(harness.routeNativeElement?.textContent).toContain(
      'Um currículo profissional',
    );
  });

  it('redirects an unknown route to Home', async () => {
    await RouterTestingHarness.create('/rota-inexistente');

    expect(TestBed.inject(Router).url).toBe('/home');
  });

  it('declares the editor, library and preview routes before the wildcard', () => {
    expect(routes.map((route) => route.path)).toEqual([
      '',
      'home',
      'resumes',
      'resume/:id/edit',
      'resume/:id/preview',
      '**',
    ]);
  });

  it('creates, persists and opens a resume from the Home action', async () => {
    const harness = await RouterTestingHarness.create('/home');
    const createButton = harness.routeNativeElement?.querySelector(
      '.actions ion-button',
    ) as HTMLElement;

    createButton.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toMatch(
      /^\/resume\/[a-z0-9-]+\/edit$/,
    );
    expect(harness.routeNativeElement?.textContent).toContain(
      'Conte sua trajetória com clareza.',
    );
    expect((await TestBed.inject(ResumeRepository).list()).length).toBe(1);
  });

  it('creates, persists and opens a resume from the empty library', async () => {
    const harness = await RouterTestingHarness.create('/home');
    const library = await harness.navigateByUrl('/resumes', MyResumesPage);
    library.ionViewWillEnter();
    await harness.fixture.whenStable();
    harness.detectChanges();
    const createButton = harness.routeNativeElement?.querySelector(
      'ion-header ion-button',
    ) as HTMLElement;

    createButton.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toMatch(
      /^\/resume\/[a-z0-9-]+\/edit$/,
    );
    expect(harness.routeNativeElement?.textContent).toContain(
      'Conte sua trajetória com clareza.',
    );
    expect((await TestBed.inject(ResumeRepository).list()).length).toBe(1);
  });
});
