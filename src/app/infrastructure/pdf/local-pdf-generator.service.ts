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

@Injectable()
export class LocalPdfGeneratorService extends PdfGeneratorService {
  override async exportAndShare(
    resume: Resume,
    templateId: ResumeTemplateId,
  ): Promise<PdfExportResult> {
    pdfMake.addVirtualFileSystem(pdfFonts);
    const pdf = pdfMake.createPdf(buildResumePdfDocument(resume, templateId));
    const filename = `${this.safeFilename(resume.title || 'curriculo')}.pdf`;

    if (!Capacitor.isNativePlatform()) {
      await pdf.download(filename);
      return { status: 'downloaded', message: 'PDF baixado com sucesso.' };
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
      return {
        status: 'saved',
        message: 'PDF salvo em Documentos/CV ATS Express.',
      };
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
      title: resume.title || 'Currículo',
      text: 'Currículo criado no CV ATS Express.',
      files: [file.uri],
      dialogTitle: 'Compartilhar currículo em PDF',
    });
    return { status: 'shared', message: 'PDF pronto para compartilhar.' };
  }

  private safeFilename(value: string): string {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    return normalized || 'curriculo';
  }

  private uniqueFilename(filename: string, resumeId: string): string {
    const stem = filename.replace(/\.pdf$/i, '');
    const id = this.safeFilename(resumeId).slice(0, 8);
    return `${stem}-${id}-${Date.now()}.pdf`;
  }
}
