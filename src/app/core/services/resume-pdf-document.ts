import type {
  Content,
  ContentStack,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

import {
  hasEducationContent,
  hasExperienceContent,
  type Resume,
} from '../models/resume.model';
import type { ResumeTemplateId } from '../models/resume-template.model';
import { getResumeCopy } from '../models/resume-copy';

const SECTION_MARGIN: [number, number, number, number] = [0, 0, 0, 12];

export function buildResumePdfDocument(
  resume: Resume,
  templateId: ResumeTemplateId,
): TDocumentDefinitions {
  const labels = getResumeCopy(resume.language);
  const content: Content[] = [buildHeader(resume)];
  const experiences = resume.experiences.filter(hasExperienceContent);
  const educationItems = resume.education.filter(hasEducationContent);

  if (resume.professionalSummary?.trim()) {
    content.push(
      section(labels.summary.toLocaleUpperCase(resume.language), [
        { text: resume.professionalSummary.trim(), style: 'body' },
      ]),
    );
  }

  if (experiences.length) {
    content.push(
      section(
        labels.experience.toLocaleUpperCase(resume.language),
        experiences.map((experience) => ({
          stack: [
            { text: experience.role || labels.roleFallback, style: 'entryTitle' },
            {
              text: [experience.company, experience.location]
                .filter(Boolean)
                .join(' · '),
              style: 'entrySubtitle',
            },
            {
              text: period(
                experience.startDate,
                experience.endDate,
                experience.current,
                labels.current,
              ),
              style: 'date',
            },
            ...(experience.description.trim()
              ? [{ text: experience.description.trim(), style: 'body' } as Content]
              : []),
          ],
          margin: [0, 0, 0, 9],
        })),
      ),
    );
  }

  if (educationItems.length) {
    content.push(
      section(
        labels.education.toLocaleUpperCase(resume.language),
        educationItems.map((education) => ({
          stack: [
            { text: education.course || labels.courseFallback, style: 'entryTitle' },
            { text: education.institution, style: 'entrySubtitle' },
            {
              text: period(education.startDate, education.endDate, false, labels.current),
              style: 'date',
            },
            ...(education.description?.trim()
              ? [{ text: education.description.trim(), style: 'body' } as Content]
              : []),
          ],
          margin: [0, 0, 0, 9],
        })),
      ),
    );
  }

  if (resume.skills.length) {
    content.push(
      section(labels.skills.toLocaleUpperCase(resume.language), [
        {
          text: resume.skills.map((skill) => skill.name).join(' · '),
          style: 'body',
        },
      ]),
    );
  }

  if (resume.languages.length) {
    content.push(
      section(labels.languages.toLocaleUpperCase(resume.language), [
        {
          text: resume.languages
            .map((item) =>
              [item.language, item.level].filter(Boolean).join(' — '),
            )
            .join(' · '),
          style: 'body',
        },
      ]),
    );
  }

  if (resume.courses.length) {
    content.push(
      section(
        labels.courses.toLocaleUpperCase(resume.language),
        resume.courses.map((course) => ({
          text: [
            course.name,
            course.institution,
            course.year,
          ]
            .filter(Boolean)
            .join(' — '),
          style: 'body',
          margin: [0, 0, 0, 4],
        })),
      ),
    );
  }

  const modern = templateId === 'modern-ats';

  return {
    info: {
      title: resume.title || labels.documentTitle,
      author: resume.personalInfo.fullName || undefined,
      subject: labels.documentSubject,
    },
    pageSize: 'A4',
    pageMargins: [48, 44, 48, 44],
    content,
    defaultStyle: {
      font: 'Roboto',
      fontSize: 9.5,
      lineHeight: 1.28,
      color: '#243247',
    },
    styles: {
      name: {
        fontSize: modern ? 25 : 23,
        bold: true,
        color: modern ? '#0f766e' : '#10213a',
      },
      role: { fontSize: 12, bold: true, color: '#3e5067', margin: [0, 3, 0, 0] },
      contact: { fontSize: 8.5, color: '#52657d', margin: [0, 5, 0, 0] },
      sectionTitle: {
        fontSize: 10,
        bold: true,
        color: modern ? '#0f766e' : '#1f4f82',
        margin: [0, 0, 0, 6],
      },
      entryTitle: { fontSize: 10, bold: true, color: '#15243a' },
      entrySubtitle: { fontSize: 9.5, bold: true, color: '#3e5067' },
      date: { fontSize: 8.5, color: '#5d6e82', margin: [0, 1, 0, 3] },
      body: { fontSize: 9.5, color: '#243247' },
    },
  };
}

function buildHeader(resume: Resume): ContentStack {
  const labels = getResumeCopy(resume.language);
  const location = [
    resume.personalInfo.city,
    resume.personalInfo.state,
    resume.personalInfo.country,
  ]
    .filter(Boolean)
    .join(', ');
  const contacts = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    location,
    resume.personalInfo.linkedin,
    resume.personalInfo.portfolio,
  ].filter((item): item is string => Boolean(item?.trim()));

  return {
    stack: [
      { text: resume.personalInfo.fullName || labels.nameFallback, style: 'name' },
      ...(resume.targetRole?.trim()
        ? [{ text: resume.targetRole.trim(), style: 'role' } as Content]
        : []),
      ...(contacts.length
        ? [{ text: contacts.join(' • '), style: 'contact' } as Content]
        : []),
    ],
    margin: [0, 0, 0, 18],
  };
}

function section(title: string, items: Content[]): ContentStack {
  return {
    stack: [{ text: title, style: 'sectionTitle' }, ...items],
    margin: SECTION_MARGIN,
  };
}

function period(
  start?: string,
  end?: string,
  current = false,
  currentLabel = 'Atual',
): string {
  if (!start && !end && !current) {
    return '';
  }

  return `${start || '—'} — ${current ? currentLabel : end || '—'}`;
}
