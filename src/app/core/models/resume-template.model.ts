export type ResumeTemplateId = 'classic-ats' | 'modern-ats';

export interface ResumeTemplateOption {
  id: ResumeTemplateId;
  name: string;
  description: string;
  premium: false;
}

export const RESUME_TEMPLATES: readonly ResumeTemplateOption[] = [
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    description: 'Tradicional, direto e altamente legível.',
    premium: false,
  },
  {
    id: 'modern-ats',
    name: 'Modern ATS',
    description: 'Contemporâneo, com cor discreta e uma coluna.',
    premium: false,
  },
];

export function isResumeTemplateId(value: string): value is ResumeTemplateId {
  return RESUME_TEMPLATES.some((template) => template.id === value);
}
