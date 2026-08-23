import { Injectable } from '@angular/core';

import type { ATSFinding, ATSScoreResult } from '../models/ats-score.model';
import {
  hasEducationContent,
  hasExperienceContent,
  type Resume,
} from '../models/resume.model';
import {
  type AppLanguage,
  type AppTranslationKey,
  translate,
} from '../i18n/app-translations';

interface ScoreRule {
  id: string;
  points: number;
  passes: (resume: Resume) => boolean;
  strengthKey: AppTranslationKey;
  suggestionKey: AppTranslationKey;
  warning?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ATSScoreService {
  private readonly actionVerbs =
    /(?:^|[\s.,;:!?])(liderei|implementei|desenvolvi|criei|aumentei|reduzi|otimizei|gerenciei|coordenei|alcancei|entreguei|automatizei|analyzed|built|created|developed|increased|led|managed|optimized|reduced|lideré|implementé|desarrollé|creé|aumenté|reduje|optimicé|gestioné|coordiné|alcancé|entregué|automaticé)(?=$|[\s.,;:!?])/i;

  private readonly rules: readonly ScoreRule[] = [
    {
      id: 'contact',
      points: 10,
      passes: (resume) =>
        Boolean(
          resume.personalInfo.fullName.trim() &&
            resume.personalInfo.email?.trim() &&
            resume.personalInfo.phone?.trim(),
        ),
      strengthKey: 'ats.contact.strength',
      suggestionKey: 'ats.contact.suggestion',
      warning: true,
    },
    {
      id: 'target-role',
      points: 5,
      passes: (resume) => Boolean(resume.targetRole?.trim()),
      strengthKey: 'ats.targetRole.strength',
      suggestionKey: 'ats.targetRole.suggestion',
    },
    {
      id: 'summary',
      points: 10,
      passes: (resume) => (resume.professionalSummary?.trim().length ?? 0) >= 80,
      strengthKey: 'ats.summary.strength',
      suggestionKey: 'ats.summary.suggestion',
    },
    {
      id: 'experience',
      points: 20,
      passes: (resume) => resume.experiences.some(hasExperienceContent),
      strengthKey: 'ats.experience.strength',
      suggestionKey: 'ats.experience.suggestion',
    },
    {
      id: 'experience-description',
      points: 10,
      passes: (resume) =>
        resume.experiences.some(hasExperienceContent) &&
        resume.experiences.filter(hasExperienceContent).every(
          (experience) => experience.description.trim().length >= 40,
        ),
      strengthKey: 'ats.experienceDescription.strength',
      suggestionKey: 'ats.experienceDescription.suggestion',
    },
    {
      id: 'education',
      points: 10,
      passes: (resume) => resume.education.some(hasEducationContent),
      strengthKey: 'ats.education.strength',
      suggestionKey: 'ats.education.suggestion',
    },
    {
      id: 'skills',
      points: 15,
      passes: (resume) => resume.skills.length >= 5,
      strengthKey: 'ats.skills.strength',
      suggestionKey: 'ats.skills.suggestion',
    },
    {
      id: 'action-verbs',
      points: 5,
      passes: (resume) =>
        resume.experiences.filter(hasExperienceContent).some((experience) =>
          this.actionVerbs.test(experience.description),
        ),
      strengthKey: 'ats.actionVerbs.strength',
      suggestionKey: 'ats.actionVerbs.suggestion',
    },
    {
      id: 'length',
      points: 5,
      passes: (resume) => {
        const length = this.resumeText(resume).length;
        return length >= 500 && length <= 6000;
      },
      strengthKey: 'ats.length.strength',
      suggestionKey: 'ats.length.suggestion',
    },
    {
      id: 'links',
      points: 5,
      passes: (resume) =>
        Boolean(
          resume.personalInfo.linkedin?.trim() ||
            resume.personalInfo.portfolio?.trim(),
        ),
      strengthKey: 'ats.links.strength',
      suggestionKey: 'ats.links.suggestion',
    },
    {
      id: 'critical-fields',
      points: 5,
      passes: (resume) =>
        Boolean(
          resume.personalInfo.fullName.trim() &&
            (resume.personalInfo.email?.trim() ||
              resume.personalInfo.phone?.trim()) &&
            resume.templateId,
        ),
      strengthKey: 'ats.criticalFields.strength',
      suggestionKey: 'ats.criticalFields.suggestion',
      warning: true,
    },
  ];

  calculate(resume: Resume, language: AppLanguage = 'pt-BR'): ATSScoreResult {
    let score = 0;
    const strengths: ATSFinding[] = [];
    const warnings: ATSFinding[] = [];
    const suggestions: ATSFinding[] = [];

    for (const rule of this.rules) {
      if (rule.passes(resume)) {
        score += rule.points;
        strengths.push(
          this.finding(rule, 'strength', translate(language, rule.strengthKey)),
        );
      } else {
        const kind = rule.warning ? 'warning' : 'suggestion';
        const finding = this.finding(
          rule,
          kind,
          translate(language, rule.suggestionKey),
        );
        (kind === 'warning' ? warnings : suggestions).push(finding);
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      strengths,
      warnings,
      suggestions,
    };
  }

  private finding(
    rule: ScoreRule,
    kind: ATSFinding['kind'],
    message: string,
  ): ATSFinding {
    return { id: rule.id, message, points: rule.points, kind };
  }

  private resumeText(resume: Resume): string {
    return [
      resume.personalInfo.fullName,
      resume.targetRole,
      resume.professionalSummary,
      ...resume.experiences.flatMap((experience) => [
        experience.role,
        experience.company,
        experience.description,
      ]),
      ...resume.education.flatMap((education) => [
        education.course,
        education.institution,
        education.description,
      ]),
      ...resume.skills.map((skill) => skill.name),
    ]
      .filter(Boolean)
      .join(' ');
  }
}
