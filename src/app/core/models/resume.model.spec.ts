import { createEmptyResume } from './resume.model';

describe('createEmptyResume', () => {
  it('creates a predictable pt-BR resume without shared collections', () => {
    const date = new Date('2026-08-16T00:00:00.000Z');
    const first = createEmptyResume('resume-1', 'pt-BR', date);
    const second = createEmptyResume('resume-2', 'pt-BR', date);

    expect(first.id).toBe('resume-1');
    expect(first.language).toBe('pt-BR');
    expect(first.templateId).toBe('classic-ats');
    expect(first.createdAt).toBe(date.toISOString());
    expect(first.updatedAt).toBe(date.toISOString());
    expect(first.personalInfo.fullName).toBe('');
    expect(first.experiences).toEqual([]);
    expect(first.experiences).not.toBe(second.experiences);
  });

  it('accepts a localized default title without changing the document language', () => {
    const resume = createEmptyResume(
      'resume-en',
      'en-US',
      new Date('2026-08-19T12:00:00.000Z'),
      'My resume',
    );

    expect(resume.title).toBe('My resume');
    expect(resume.language).toBe('en-US');
  });
});
