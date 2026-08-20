import { Component } from '@angular/core';
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
