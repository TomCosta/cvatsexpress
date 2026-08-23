import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import type { Resume } from '../../core/models/resume.model';
import type { ResumeTemplateId } from '../../core/models/resume-template.model';
import {
  PdfGeneratorService,
  type PdfExportResult,
} from '../../core/services/pdf-generator.service';
import { buildResumePdfDocument } from '../../core/services/resume-pdf-document';
import {
  type AppLanguage,
  translate,
} from '../../core/i18n/app-translations';

@Injectable()
export class LocalPdfGeneratorService extends PdfGeneratorService {
  override async exportAndShare(
    resume: Resume,
    templateId: ResumeTemplateId,
    appLanguage: AppLanguage,
  ): Promise<PdfExportResult> {
    pdfMake.addVirtualFileSystem(pdfFonts);
    const pdf = pdfMake.createPdf(buildResumePdfDocument(resume, templateId));
    const filenameFallback = translate(appLanguage, 'pdf.filenameFallback');
    const filename = `${this.safeFilename(resume.title, filenameFallback)}.pdf`;

    if (!Capacitor.isNativePlatform()) {
      await pdf.download(filename);
      return { status: 'downloaded' };
    }

    const availability = await Share.canShare();
    if (!availability.value) {
      const documentsDirectory = 'CV ATS Express';
      await Filesystem.mkdir({
        path: documentsDirectory,
        directory: Directory.Documents,
        recursive: true,
      });
      await Filesystem.writeFile({
        path: `${documentsDirectory}/${filename}`,
        data: await pdf.getBase64(),
        directory: Directory.Documents,
      });
      return { status: 'saved' };
    }

    const directory = 'shared';
    await Filesystem.mkdir({
      path: directory,
      directory: Directory.Cache,
      recursive: true,
    });
    const file = await Filesystem.writeFile({
      path: `${directory}/${this.uniqueFilename(filename, resume.id)}`,
      data: await pdf.getBase64(),
      directory: Directory.Cache,
    });
    await Share.share({
      title: resume.title || translate(appLanguage, 'pdf.shareTitle'),
      text: translate(appLanguage, 'pdf.shareText'),
      files: [file.uri],
      dialogTitle: translate(appLanguage, 'pdf.shareDialog'),
    });
    return { status: 'shared' };
  }

  private safeFilename(value: string, fallback = 'resume'): string {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    return normalized || fallback;
  }

  private uniqueFilename(filename: string, resumeId: string): string {
    const stem = filename.replace(/\.pdf$/i, '');
    const id = this.safeFilename(resumeId).slice(0, 8);
    return `${stem}-${id}-${Date.now()}.pdf`;
  }
}
