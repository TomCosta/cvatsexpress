import type { Resume } from '../models/resume.model';

export abstract class ResumeRepository {
  abstract list(): Promise<readonly Resume[]>;
  abstract findById(id: string): Promise<Resume | null>;
  abstract save(resume: Resume): Promise<Resume>;
  abstract duplicate(id: string, copyLabel?: string): Promise<Resume>;
  abstract delete(id: string): Promise<void>;
}
