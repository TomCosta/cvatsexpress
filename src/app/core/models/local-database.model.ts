import type { Resume } from './resume.model';

export const CURRENT_SCHEMA_VERSION = 1;

export interface LocalDatabase {
  schemaVersion: number;
  resumes: Resume[];
}
