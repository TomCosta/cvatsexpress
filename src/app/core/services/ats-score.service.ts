import { Injectable } from '@angular/core';

import type { ATSFinding, ATSScoreResult } from '../models/ats-score.model';
import {
  hasEducationContent,
  hasExperienceContent,
  type Resume,
} from '../models/resume.model';

interface ScoreRule {
  id: string;
  points: number;
  passes: (resume: Resume) => boolean;
  strength: string;
  suggestion: string;
  warning?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ATSScoreService {
  private readonly actionVerbs =
    /\b(liderei|implementei|desenvolvi|criei|aumentei|reduzi|otimizei|gerenciei|coordenei|alcancei|entreguei|automatizei|analyzed|built|created|developed|increased|led|managed|optimized|reduced)\b/i;

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
      strength: 'Informações de contato completas.',
      suggestion: 'Informe nome, email e telefone.',
      warning: true,
    },
    {
      id: 'target-role',
      points: 5,
      passes: (resume) => Boolean(resume.targetRole?.trim()),
      strength: 'Cargo desejado informado.',
      suggestion: 'Adicione o cargo desejado para dar foco ao currículo.',
    },
    {
      id: 'summary',
      points: 10,
      passes: (resume) => (resume.professionalSummary?.trim().length ?? 0) >= 80,
      strength: 'Resumo profissional com bom nível de detalhe.',
      suggestion: 'Escreva um resumo específico com pelo menos 80 caracteres.',
    },
    {
      id: 'experience',
      points: 20,
      passes: (resume) => resume.experiences.some(hasExperienceContent),
      strength: 'Experiência profissional encontrada.',
      suggestion:
        'Adicione experiência profissional, projeto relevante ou trabalho voluntário.',
    },
    {
      id: 'experience-description',
      points: 10,
      passes: (resume) =>
        resume.experiences.some(hasExperienceContent) &&
        resume.experiences.filter(hasExperienceContent).every(
          (experience) => experience.description.trim().length >= 40,
        ),
      strength: 'Experiências possuem descrições consistentes.',
      suggestion: 'Detalhe responsabilidades e resultados em cada experiência.',
    },
    {
      id: 'education',
      points: 10,
      passes: (resume) => resume.education.some(hasEducationContent),
      strength: 'Formação informada.',
      suggestion: 'Inclua sua formação ou curso principal quando aplicável.',
    },
    {
      id: 'skills',
      points: 15,
      passes: (resume) => resume.skills.length >= 5,
      strength: 'Boa quantidade de competências relevantes.',
      suggestion: 'Adicione pelo menos cinco competências relevantes para a vaga.',
    },
    {
      id: 'action-verbs',
      points: 5,
      passes: (resume) =>
        resume.experiences.filter(hasExperienceContent).some((experience) =>
          this.actionVerbs.test(experience.description),
        ),
      strength: 'Descrições usam verbos de ação.',
      suggestion: 'Comece realizações com verbos de ação, como “implementei” ou “liderei”.',
    },
    {
      id: 'length',
      points: 5,
      passes: (resume) => {
        const length = this.resumeText(resume).length;
        return length >= 500 && length <= 6000;
      },
      strength: 'Quantidade de conteúdo adequada para leitura.',
      suggestion: 'Adicione conteúdo objetivo; evite um currículo curto ou longo demais.',
    },
    {
      id: 'links',
      points: 5,
      passes: (resume) =>
        Boolean(
          resume.personalInfo.linkedin?.trim() ||
            resume.personalInfo.portfolio?.trim(),
        ),
      strength: 'Link profissional informado.',
      suggestion: 'Inclua LinkedIn ou portfólio quando relevante.',
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
      strength: 'Nenhum campo crítico está vazio.',
      suggestion: 'Preencha nome e ao menos uma forma de contato.',
      warning: true,
    },
  ];

  calculate(resume: Resume): ATSScoreResult {
    let score = 0;
    const strengths: ATSFinding[] = [];
    const warnings: ATSFinding[] = [];
    const suggestions: ATSFinding[] = [];

    for (const rule of this.rules) {
      if (rule.passes(resume)) {
        score += rule.points;
        strengths.push(this.finding(rule, 'strength', rule.strength));
      } else {
        const kind = rule.warning ? 'warning' : 'suggestion';
        const finding = this.finding(rule, kind, rule.suggestion);
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
