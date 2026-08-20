import type { Resume } from '../models/resume.model';
import type { ResumeTemplateId } from '../models/resume-template.model';

export interface PdfExportResult {
  status: 'downloaded' | 'shared' | 'saved';
  message: string;
}

export abstract class PdfGeneratorService {
  abstract exportAndShare(
    resume: Resume,
    templateId: ResumeTemplateId,
  ): Promise<PdfExportResult>;
}
