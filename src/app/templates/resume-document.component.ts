import { Component, input } from '@angular/core';

import {
  hasEducationContent,
  hasExperienceContent,
  type Education,
  type Experience,
  type Resume,
} from '../core/models/resume.model';
import type { ResumeTemplateId } from '../core/models/resume-template.model';
import { getResumeCopy } from '../core/models/resume-copy';

@Component({
  selector: 'app-resume-document',
  standalone: true,
  templateUrl: './resume-document.component.html',
  styleUrls: ['./resume-document.component.scss'],
})
export class ResumeDocumentComponent {
  readonly resume = input.required<Resume>();
  readonly templateId = input.required<ResumeTemplateId>();
  protected readonly copy = getResumeCopy;

  protected meaningfulExperiences(resume: Resume): Experience[] {
    return resume.experiences.filter(hasExperienceContent);
  }

  protected meaningfulEducation(resume: Resume): Education[] {
    return resume.education.filter(hasEducationContent);
  }

  protected contactItems(resume: Resume): string[] {
    const location = [
      resume.personalInfo.city,
      resume.personalInfo.state,
      resume.personalInfo.country,
    ]
      .filter(Boolean)
      .join(', ');

    return [
      resume.personalInfo.email,
      resume.personalInfo.phone,
      location,
      resume.personalInfo.linkedin,
      resume.personalInfo.portfolio,
    ].filter((item): item is string => Boolean(item?.trim()));
  }

  protected period(
    currentLabel: string,
    start?: string,
    end?: string,
    current = false,
  ): string {
    if (!start && !end && !current) {
      return '';
    }

    return `${start || '—'} — ${current ? currentLabel : end || '—'}`;
  }
}
