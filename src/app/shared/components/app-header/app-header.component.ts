import { Component, inject } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, languageOutline } from 'ionicons/icons';

import { APP_CONFIG } from '../../../core/config/app-config';
import { AppLanguageService } from '../../../core/i18n/app-language.service';
import {
  type AppLanguage,
  isAppLanguage,
} from '../../../core/i18n/app-translations';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar],
})
export class AppHeaderComponent {
  protected readonly appName = inject(APP_CONFIG).appName;
  protected readonly i18n = inject(AppLanguageService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  constructor() {
    addIcons({ documentTextOutline, languageOutline });
  }

  protected currentLanguageLabel(): string {
    return (
      this.i18n.options.find((option) => option.value === this.i18n.language())
        ?.shortLabel ?? 'PT-BR'
    );
  }

  protected async openLanguageSelector(): Promise<void> {
    const alert = await this.alertController.create({
      header: this.i18n.t('language.selectorTitle'),
      message: this.i18n.t('language.selectorMessage'),
      inputs: this.i18n.options.map((option) => ({
        type: 'radio' as const,
        label: option.nativeName,
        value: option.value,
        checked: option.value === this.i18n.language(),
      })),
      buttons: [
        { text: this.i18n.t('common.cancel'), role: 'cancel' },
        {
          text: this.i18n.t('common.select'),
          handler: (value: unknown) => {
            if (isAppLanguage(value)) {
              void this.changeLanguage(value);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  private async changeLanguage(language: AppLanguage): Promise<void> {
    if (await this.i18n.setLanguage(language)) {
      return;
    }

    const toast = await this.toastController.create({
      message: this.i18n.t('language.saveError'),
      duration: 4000,
      position: 'bottom',
    });
    await toast.present();
  }
}
