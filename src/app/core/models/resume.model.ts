export type ResumeLanguage = 'pt-BR' | 'en-US' | 'es-ES' | 'es-419';

export interface PersonalInfo {
  fullName: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  course: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface LanguageSkill {
  id: string;
  language: string;
  level?: string;
}

export interface Course {
  id: string;
  name: string;
  institution?: string;
  year?: string;
}

export interface Resume {
  id: string;
  title: string;
  language: ResumeLanguage;
  personalInfo: PersonalInfo;
  targetRole?: string;
  professionalSummary?: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: LanguageSkill[];
  courses: Course[];
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export function hasExperienceContent(experience: Experience): boolean {
  return Boolean(
    experience.company.trim() ||
      experience.role.trim() ||
      experience.description.trim(),
  );
}

export function hasExperienceDraftContent(experience: Experience): boolean {
  return Boolean(
    hasExperienceContent(experience) ||
      experience.location?.trim() ||
      experience.startDate?.trim() ||
      experience.endDate?.trim() ||
      experience.current,
  );
}

export function hasEducationContent(education: Education): boolean {
  return Boolean(
    education.institution.trim() ||
      education.course.trim() ||
      education.description?.trim(),
  );
}

export function hasEducationDraftContent(education: Education): boolean {
  return Boolean(
    hasEducationContent(education) ||
      education.startDate?.trim() ||
      education.endDate?.trim(),
  );
}

export function createEmptyResume(
  id: string,
  language: ResumeLanguage,
  now = new Date(),
): Resume {
  const timestamp = now.toISOString();

  return {
    id,
    title: 'Meu currículo',
    language,
    personalInfo: { fullName: '' },
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    courses: [],
    templateId: 'classic-ats',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
