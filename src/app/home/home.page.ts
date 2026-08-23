import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  checkmarkCircleOutline,
  cloudOfflineOutline,
  documentTextOutline,
  folderOpenOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import { AppHeaderComponent } from '../shared/components/app-header/app-header.component';
import { AppLanguageService } from '../core/i18n/app-language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    AppHeaderComponent,
    RouterLink,
    IonButton,
    IonContent,
    IonIcon,
    IonText,
  ],
})
export class HomePage {
  protected readonly i18n = inject(AppLanguageService);

  constructor() {
    addIcons({
      arrowForwardOutline,
      checkmarkCircleOutline,
      cloudOfflineOutline,
      documentTextOutline,
      folderOpenOutline,
      shieldCheckmarkOutline,
    });
  }
}
