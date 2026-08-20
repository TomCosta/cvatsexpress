import { createEmptyResume, type Resume } from '../models/resume.model';
import { ATSScoreService } from './ats-score.service';

describe('ATSScoreService', () => {
  let service: ATSScoreService;

  beforeEach(() => {
    service = new ATSScoreService();
  });

  it('scores an empty resume without leaving the 0–100 range', () => {
    const result = service.calculate(createEmptyResume('empty', 'pt-BR'));

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.suggestions.some((item) => item.id === 'skills')).toBeTrue();
  });

  it('scores a minimum resume below a complete one', () => {
    const minimum = createEmptyResume('minimum', 'pt-BR');
    minimum.personalInfo = {
      fullName: 'Ana Silva',
      email: 'ana@example.com',
      phone: '11999999999',
    };

    expect(service.calculate(minimum).score).toBeLessThan(
      service.calculate(completeResume()).score,
    );
  });

  it('gives a complete resume the maximum score', () => {
    const result = service.calculate(completeResume());

    expect(result.score).toBe(100);
    expect(result.warnings).toEqual([]);
    expect(result.strengths.length).toBe(11);
  });

  it('keeps suggestions coherent with missing fields', () => {
    const result = service.calculate(createEmptyResume('empty', 'pt-BR'));

    expect(result.suggestions.map((item) => item.id)).toContain('summary');
    expect(result.strengths.map((item) => item.id)).not.toContain('summary');
  });

  it('does not award section points for empty repeated entries', () => {
    const resume = createEmptyResume('empty-rows', 'pt-BR');
    resume.experiences = [
      {
        id: 'exp-empty',
        company: '',
        role: '',
        current: false,
        description: '',
      },
    ];
    resume.education = [
      { id: 'edu-empty', institution: '', course: '' },
    ];

    const result = service.calculate(resume);

    expect(result.strengths.map((item) => item.id)).not.toContain('experience');
    expect(result.strengths.map((item) => item.id)).not.toContain('education');
  });

  function completeResume(): Resume {
    const resume = createEmptyResume('complete', 'pt-BR');
    resume.personalInfo = {
      fullName: 'Ana Silva',
      email: 'ana@example.com',
      phone: '11999999999',
      city: 'São Paulo',
      linkedin: 'https://linkedin.com/in/ana',
    };
    resume.targetRole = 'Engenheira de Software';
    resume.professionalSummary =
      'Engenheira de software com experiência em produtos digitais, arquitetura front-end e colaboração com times multidisciplinares para entregar resultados consistentes.';
    resume.experiences = [
      {
        id: 'exp-1',
        company: 'Empresa',
        role: 'Engenheira de Software',
        current: true,
        description:
          'Liderei a implementação de uma plataforma web para equipes distribuídas, defini métricas com as áreas de produto e atendimento e reduzi em 30% o tempo das operações. Implementei testes automatizados, organizei a documentação técnica, acompanhei indicadores de qualidade e coordenei entregas incrementais com design e negócio. Também desenvolvi melhorias de acessibilidade, otimizei o carregamento das telas e apoiei profissionais em início de carreira por meio de revisões de código e sessões de compartilhamento de conhecimento.',
      },
    ];
    resume.education = [
      {
        id: 'edu-1',
        institution: 'Universidade',
        course: 'Sistemas de Informação',
        description:
          'Formação com foco em engenharia de software, produto digital e qualidade de sistemas.',
      },
    ];
    resume.skills = ['Angular', 'TypeScript', 'Testes', 'Liderança', 'UX'].map(
      (name, index) => ({ id: `skill-${index}`, name }),
    );
    return resume;
  }
});
