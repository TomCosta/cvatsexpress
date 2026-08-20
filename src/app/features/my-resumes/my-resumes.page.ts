import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-my-resumes',
  standalone: true,
  templateUrl: './my-resumes.page.html',
  styleUrls: ['./my-resumes.page.scss'],
  imports: [
    DatePipe,
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
  private readonly repository = inject(ResumeRepository);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);

  protected readonly resumes = signal<readonly Resume[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() {
    addIcons({
      addOutline,
      copyOutline,
      createOutline,
      documentTextOutline,
      eyeOutline,
      trashOutline,
    });
  }

  ionViewWillEnter(): void {
    void this.load();
  }

  protected templateName(templateId: string): string {
    return (
      RESUME_TEMPLATES.find((template) => template.id === templateId)?.name ??
      'Classic ATS'
    );
  }

  protected async duplicate(resume: Resume): Promise<void> {
    try {
      const duplicated = await this.repository.duplicate(resume.id);
      await this.load();
      await this.router.navigate(['/resume', duplicated.id, 'edit']);
    } catch {
      this.error.set('Não foi possível duplicar o currículo.');
    }
  }

  protected async rename(resume: Resume): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Renomear currículo',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: resume.title,
          placeholder: 'Nome do currículo',
          attributes: { maxlength: 80 },
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
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
      header: 'Excluir currículo?',
      message: `“${resume.title}” será removido deste dispositivo. Esta ação não pode ser desfeita.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            void this.deleteResume(resume.id);
          },
        },
      ],
    });
    await alert.present();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.resumes.set(await this.repository.list());
    } catch {
      this.error.set('Não foi possível ler os currículos deste dispositivo.');
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
      this.error.set('Não foi possível renomear o currículo.');
    }
  }

  private async deleteResume(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      await this.load();
    } catch {
      this.error.set('Não foi possível excluir o currículo.');
    }
  }
}
