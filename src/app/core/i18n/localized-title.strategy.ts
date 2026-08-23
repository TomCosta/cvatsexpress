import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { AppLanguageService } from './app-language.service';
import type { AppTranslationKey } from './app-translations';

@Injectable()
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly browserTitle = inject(Title);
  private readonly i18n = inject(AppLanguageService);
  private readonly routeTitleKey = signal<AppTranslationKey>('route.home');

  constructor() {
    super();
    effect(() => {
      this.i18n.language();
      this.browserTitle.setTitle(this.i18n.t(this.routeTitleKey()));
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    let titleKey: AppTranslationKey = 'route.home';

    while (route) {
      if (route.data['titleKey']) {
        titleKey = route.data['titleKey'] as AppTranslationKey;
      }
      route = route.children[0];
    }

    this.routeTitleKey.set(titleKey);
  }
}
