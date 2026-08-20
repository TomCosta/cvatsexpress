export type ATSFindingKind = 'strength' | 'warning' | 'suggestion';

export interface ATSFinding {
  id: string;
  message: string;
  points: number;
  kind: ATSFindingKind;
}

export interface ATSScoreResult {
  score: number;
  strengths: ATSFinding[];
  warnings: ATSFinding[];
  suggestions: ATSFinding[];
}
