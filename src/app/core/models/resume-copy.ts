import type { ResumeLanguage } from './resume.model';

export interface ResumeCopy {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  courses: string;
  current: string;
  roleFallback: string;
  courseFallback: string;
}

const COPY: Record<ResumeLanguage, ResumeCopy> = {
  'pt-BR': {
    summary: 'Resumo profissional', experience: 'Experiência profissional',
    education: 'Formação', skills: 'Competências', languages: 'Idiomas',
    courses: 'Cursos e certificações', current: 'Atual', roleFallback: 'Cargo',
    courseFallback: 'Curso',
  },
  'en-US': {
    summary: 'Professional summary', experience: 'Professional experience',
    education: 'Education', skills: 'Skills', languages: 'Languages',
    courses: 'Courses and certifications', current: 'Present', roleFallback: 'Role',
    courseFallback: 'Course',
  },
  'es-ES': {
    summary: 'Resumen profesional', experience: 'Experiencia profesional',
    education: 'Formación', skills: 'Competencias', languages: 'Idiomas',
    courses: 'Cursos y certificaciones', current: 'Actualidad', roleFallback: 'Puesto',
    courseFallback: 'Curso',
  },
  'es-419': {
    summary: 'Resumen profesional', experience: 'Experiencia profesional',
    education: 'Educación', skills: 'Habilidades', languages: 'Idiomas',
    courses: 'Cursos y certificaciones', current: 'Actualidad', roleFallback: 'Puesto',
    courseFallback: 'Curso',
  },
};

export function getResumeCopy(language: ResumeLanguage): ResumeCopy {
  return COPY[language];
}
