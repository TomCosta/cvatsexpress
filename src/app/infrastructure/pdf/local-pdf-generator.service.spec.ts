import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { createEmptyResume } from '../../core/models/resume.model';
import { buildResumePdfDocument } from '../../core/services/resume-pdf-document';

describe('pdfmake integration', () => {
  it('generates a non-empty PDF with selectable document content', async () => {
    const resume = createEmptyResume('resume-pdf', 'pt-BR');
    resume.personalInfo.fullName = 'Ana Silva';
    resume.targetRole = 'Desenvolvedora';
    pdfMake.addVirtualFileSystem(pdfFonts);

    const base64 = await pdfMake
      .createPdf(buildResumePdfDocument(resume, 'classic-ats'))
      .getBase64();

    expect(base64.startsWith('JVBERi')).toBeTrue();
    expect(base64.length).toBeGreaterThan(1000);
  });
});
