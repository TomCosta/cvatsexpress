import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import type { AppTranslationKey } from '../core/i18n/app-translations';
import { CreateResumeService } from '../core/services/create-resume.service';

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
  private readonly createResumeService = inject(CreateResumeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  protected readonly i18n = inject(AppLanguageService);
  protected readonly creating = signal(false);
  private readonly creationMessageKey = signal<AppTranslationKey | null>(null);
  private pendingResumeId: string | null = null;
  private viewActive = true;
  private viewEpoch = 0;

  constructor() {
    addIcons({
      arrowForwardOutline,
      checkmarkCircleOutline,
      cloudOfflineOutline,
      documentTextOutline,
      folderOpenOutline,
      shieldCheckmarkOutline,
    });
    this.destroyRef.onDestroy(() => this.deactivateView());
  }

  ionViewWillEnter(): void {
    this.viewActive = true;
  }

  ionViewWillLeave(): void {
    this.deactivateView();
  }

  protected creationMessage(): string {
    const key = this.creationMessageKey();
    return key ? this.i18n.t(key) : '';
  }

  protected creationActionLabel(): string {
    if (this.creating()) {
      return this.i18n.t('common.creating');
    }
    if (this.pendingResumeId) {
      return this.i18n.t('common.openResume');
    }
    return this.i18n.t('home.create');
  }

  protected async createResume(): Promise<void> {
    if (this.creating()) {
      return;
    }

    const operationEpoch = this.viewEpoch;
    this.creating.set(true);
    this.creationMessageKey.set(null);
    if (!this.pendingResumeId) {
      try {
        this.pendingResumeId = (await this.createResumeService.create()).id;
      } catch {
        if (this.isCurrentView(operationEpoch)) {
          this.creationMessageKey.set('home.createError');
        }
        this.creating.set(false);
        return;
      }
    }

    if (!this.isCurrentView(operationEpoch)) {
      this.pendingResumeId = null;
      this.creating.set(false);
      return;
    }

    try {
      const navigated = await this.router.navigate([
        '/resume',
        this.pendingResumeId,
        'edit',
      ]);
      if (!navigated) {
        throw new Error('Resume editor navigation was cancelled.');
      }
      this.pendingResumeId = null;
    } catch {
      if (this.isCurrentView(operationEpoch)) {
        this.creationMessageKey.set('home.errorOpenCreated');
      }
    } finally {
      this.creating.set(false);
    }
  }

  private isCurrentView(operationEpoch: number): boolean {
    return this.viewActive && operationEpoch === this.viewEpoch;
  }

  private deactivateView(): void {
    this.viewActive = false;
    this.viewEpoch += 1;
    this.pendingResumeId = null;
    this.creationMessageKey.set(null);
  }
}
