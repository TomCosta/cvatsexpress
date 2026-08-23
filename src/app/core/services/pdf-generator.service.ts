import type { Resume } from '../models/resume.model';
import type { ResumeTemplateId } from '../models/resume-template.model';
import type { AppLanguage } from '../i18n/app-translations';

export interface PdfExportResult {
  status: 'downloaded' | 'shared' | 'saved';
}

export abstract class PdfGeneratorService {
  abstract exportAndShare(
    resume: Resume,
    templateId: ResumeTemplateId,
    appLanguage: AppLanguage,
  ): Promise<PdfExportResult>;
}
