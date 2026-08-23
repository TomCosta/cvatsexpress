import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config';
import { KeyValueStorage } from './core/storage/key-value.storage';

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
      'resume/new',
      'resume/:id/edit',
      'resume/:id/preview',
      '**',
    ]);
  });
});
