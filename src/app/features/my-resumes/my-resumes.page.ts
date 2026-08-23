import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  copyOutline,
  createOutline,
  documentTextOutline,
  eyeOutline,
  trashOutline,
} from 'ionicons/icons';

import type { Resume } from '../../core/models/resume.model';
import { ResumeRepository } from '../../core/repositories/resume.repository';
import { RESUME_TEMPLATES } from '../../core/models/resume-template.model';
import { AppLanguageService } from '../../core/i18n/app-language.service';
import type { AppTranslationKey } from '../../core/i18n/app-translations';
import { CreateResumeService } from '../../core/services/create-resume.service';

@Component({
  selector: 'app-my-resumes',
  standalone: true,
  templateUrl: './my-resumes.page.html',
  styleUrls: ['./my-resumes.page.scss'],
  imports: [
    RouterLink,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
  ],
})
export class MyResumesPage {
  private readonly createResumeService = inject(CreateResumeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly repository = inject(ResumeRepository);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);
  protected readonly i18n = inject(AppLanguageService);

  protected readonly resumes = signal<readonly Resume[]>([]);
  protected readonly loading = signal(true);
  private readonly errorKey = signal<AppTranslationKey | null>(null);
  protected readonly creating = signal(false);
  private pendingResumeId: string | null = null;
  private viewActive = true;
  private viewEpoch = 0;
  private dateFormatterLanguage = '';
  private dateFormatter?: Intl.DateTimeFormat;

  constructor() {
    addIcons({
      addOutline,
      copyOutline,
      createOutline,
      documentTextOutline,
      eyeOutline,
      trashOutline,
    });
    this.destroyRef.onDestroy(() => this.deactivateView());
  }

  ionViewWillEnter(): void {
    this.viewActive = true;
    void this.load();
  }

  ionViewWillLeave(): void {
    this.deactivateView();
  }

  protected errorMessage(): string {
    const key = this.errorKey();
    return key ? this.i18n.t(key) : '';
  }

  protected templateName(templateId: string): string {
    return (
      RESUME_TEMPLATES.find((template) => template.id === templateId)?.name ??
      'Classic ATS'
    );
  }

  protected async duplicate(resume: Resume): Promise<void> {
    try {
      const duplicated = await this.repository.duplicate(
        resume.id,
        this.i18n.t('common.copySuffix'),
      );
      await this.load();
      await this.router.navigate(['/resume', duplicated.id, 'edit']);
    } catch {
      this.errorKey.set('library.errorDuplicate');
    }
  }

  protected async createResume(): Promise<void> {
    if (this.creating()) {
      return;
    }

    const operationEpoch = this.viewEpoch;
    this.creating.set(true);
    this.errorKey.set(null);
    if (!this.pendingResumeId) {
      try {
        this.pendingResumeId = (await this.createResumeService.create()).id;
      } catch {
        if (this.isCurrentView(operationEpoch)) {
          this.errorKey.set('library.errorCreate');
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
      this.pendingResumeId = null;
      if (await this.load()) {
        this.errorKey.set('library.errorOpenCreated');
      }
    } finally {
      this.creating.set(false);
    }
  }

  protected async rename(resume: Resume): Promise<void> {
    const alert = await this.alertController.create({
      header: this.i18n.t('library.renameTitle'),
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: resume.title,
          placeholder: this.i18n.t('library.resumeName'),
          attributes: { maxlength: 80 },
        },
      ],
      buttons: [
        { text: this.i18n.t('common.cancel'), role: 'cancel' },
        {
          text: this.i18n.t('common.save'),
          handler: (values: { title?: string }) => {
            const title = values.title?.trim();
            if (!title) {
              return false;
            }
            void this.updateTitle(resume, title);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  protected async confirmDelete(resume: Resume): Promise<void> {
    const alert = await this.alertController.create({
      header: this.i18n.t('library.deleteTitle'),
      message: this.i18n.t('library.deleteMessage', { title: resume.title }),
      buttons: [
        { text: this.i18n.t('common.cancel'), role: 'cancel' },
        {
          text: this.i18n.t('common.delete'),
          role: 'destructive',
          handler: () => {
            void this.deleteResume(resume.id);
          },
        },
      ],
    });
    await alert.present();
  }

  private async load(): Promise<boolean> {
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      this.resumes.set(await this.repository.list());
      return true;
    } catch {
      this.errorKey.set('library.errorRead');
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  private async updateTitle(resume: Resume, title: string): Promise<void> {
    try {
      await this.repository.save({
        ...resume,
        title,
        updatedAt: new Date().toISOString(),
      });
      await this.load();
    } catch {
      this.errorKey.set('library.errorRename');
    }
  }

  private async deleteResume(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      await this.load();
    } catch {
      this.errorKey.set('library.errorDelete');
    }
  }

  protected formattedDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const language = this.i18n.language();
    if (!this.dateFormatter || this.dateFormatterLanguage !== language) {
      this.dateFormatterLanguage = language;
      this.dateFormatter = new Intl.DateTimeFormat(language, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    }

    return this.dateFormatter.format(date);
  }

  private isCurrentView(operationEpoch: number): boolean {
    return this.viewActive && operationEpoch === this.viewEpoch;
  }

  private deactivateView(): void {
    this.viewActive = false;
    this.viewEpoch += 1;
    this.pendingResumeId = null;
  }
}
