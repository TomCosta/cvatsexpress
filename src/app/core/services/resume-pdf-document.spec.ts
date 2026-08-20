import { createEmptyResume } from '../models/resume.model';
import { buildResumePdfDocument } from './resume-pdf-document';

describe('buildResumePdfDocument', () => {
  it('creates a selectable text document with resume sections', () => {
    const resume = createEmptyResume('resume-1', 'pt-BR');
    resume.title = 'Currículo de Ana';
    resume.personalInfo = {
      fullName: 'Ana Silva',
      email: 'ana@example.com',
      phone: '+55 11 99999-9999',
    };
    resume.targetRole = 'Desenvolvedora Front-end';
    resume.professionalSummary = 'Resumo profissional da candidata.';
    resume.skills = [{ id: 'skill-1', name: 'Angular' }];

    const definition = buildResumePdfDocument(resume, 'classic-ats');
    const serialized = JSON.stringify(definition);

    expect(definition.pageSize).toBe('A4');
    expect(serialized).toContain('Ana Silva');
    expect(serialized).toContain('RESUMO PROFISSIONAL');
    expect(serialized).toContain('Angular');
    expect(serialized).not.toContain('canvas');
  });

  it('omits empty repeated entries from the document', () => {
    const resume = createEmptyResume('resume-empty-rows', 'pt-BR');
    resume.experiences = [
      { id: 'exp-empty', company: '', role: '', current: false, description: '' },
    ];

    const serialized = JSON.stringify(
      buildResumePdfDocument(resume, 'classic-ats'),
    );

    expect(serialized).not.toContain('EXPERIÊNCIA PROFISSIONAL');
    expect(serialized).not.toContain('Cargo');
  });
});
