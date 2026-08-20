import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  createOutline,
  downloadOutline,
  informationCircleOutline,
  warningOutline,
} from 'ionicons/icons';

import type { ATSScoreResult } from '../../core/models/ats-score.model';
import type { Resume } from '../../core/models/resume.model';
import { ResumeRepository } from '../../core/repositories/resume.repository';
import { ATSScoreService } from '../../core/services/ats-score.service';
import { PdfGeneratorService } from '../../core/services/pdf-generator.service';
import { LocalPdfGeneratorService } from '../../infrastructure/pdf/local-pdf-generator.service';
import { ResumeDocumentComponent } from '../../templates/resume-document.component';
import {
  isResumeTemplateId,
  RESUME_TEMPLATES,
  type ResumeTemplateId,
} from '../../core/models/resume-template.model';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  templateUrl: './resume-preview.page.html',
  styleUrls: ['./resume-preview.page.scss'],
  providers: [
    { provide: PdfGeneratorService, useClass: LocalPdfGeneratorService },
  ],
  imports: [
    RouterLink,
    ResumeDocumentComponent,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  ],
})
export class ResumePreviewPage {
  private readonly repository = inject(ResumeRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly atsScoreService = inject(ATSScoreService);
  private readonly pdfGenerator = inject(PdfGeneratorService);

  protected readonly templates = RESUME_TEMPLATES;
  protected readonly resume = signal<Resume | null>(null);
  protected readonly templateId = signal<ResumeTemplateId>('classic-ats');
  protected readonly score = signal<ATSScoreResult | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly exportState = signal<'idle' | 'working' | 'error'>('idle');
  protected readonly exportMessage = signal('');

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      createOutline,
      downloadOutline,
      informationCircleOutline,
      warningOutline,
    });
    void this.load();
  }

  protected async selectTemplate(value: string | undefined): Promise<void> {
    const resume = this.resume();
    if (!resume || !value || !isResumeTemplateId(value)) {
      return;
    }

    this.templateId.set(value);
    const updated = {
      ...resume,
      templateId: value,
      updatedAt: new Date().toISOString(),
    };
    this.resume.set(updated);
    this.score.set(this.atsScoreService.calculate(updated));

    try {
      this.resume.set(await this.repository.save(updated));
    } catch {
      this.error.set('O modelo foi aplicado, mas não pôde ser salvo.');
    }
  }

  protected async exportPdf(): Promise<void> {
    const resume = this.resume();
    if (!resume) {
      return;
    }

    this.exportState.set('working');
    this.exportMessage.set('');
    try {
      const result = await this.pdfGenerator.exportAndShare(
        resume,
        this.templateId(),
      );
      this.exportMessage.set(result.message);
      this.exportState.set('idle');
    } catch {
      this.exportState.set('error');
    }
  }

  protected canExport(resume: Resume): boolean {
    return Boolean(resume.personalInfo.fullName.trim());
  }

  private async load(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Currículo não identificado.');
      this.loading.set(false);
      return;
    }

    try {
      const resume = await this.repository.findById(id);
      if (!resume) {
        this.error.set('Este currículo não foi encontrado.');
        return;
      }

      const templateId = isResumeTemplateId(resume.templateId)
        ? resume.templateId
        : 'classic-ats';
      this.resume.set(resume);
      this.templateId.set(templateId);
      this.score.set(this.atsScoreService.calculate(resume));
    } catch {
      this.error.set('Não foi possível carregar o currículo salvo.');
    } finally {
      this.loading.set(false);
    }
  }
}
