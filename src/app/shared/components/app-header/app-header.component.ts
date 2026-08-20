import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';

import { APP_CONFIG } from '../../../core/config/app-config';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [IonHeader, IonIcon, IonTitle, IonToolbar],
})
export class AppHeaderComponent {
  protected readonly appName = inject(APP_CONFIG).appName;

  constructor() {
    addIcons({ documentTextOutline });
  }
}
