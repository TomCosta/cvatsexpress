import { inject, Injectable } from '@angular/core';

import {
  CURRENT_SCHEMA_VERSION,
  type LocalDatabase,
} from '../models/local-database.model';
import type { Resume } from '../models/resume.model';
import { KeyValueStorage } from '../storage/key-value.storage';
import { ResumeRepository } from './resume.repository';

export const LOCAL_DATABASE_KEY = 'cv-ats-express.database';

@Injectable()
export class LocalResumeRepository extends ResumeRepository {
  private readonly storage = inject(KeyValueStorage);
  private mutationQueue: Promise<void> = Promise.resolve();

  override async list(): Promise<readonly Resume[]> {
    await this.mutationQueue;
    const database = await this.loadDatabase();
    return database.resumes
      .map((resume) => this.clone(resume))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  override async findById(id: string): Promise<Resume | null> {
    await this.mutationQueue;
    const database = await this.loadDatabase();
    const resume = database.resumes.find((item) => item.id === id);
    return resume ? this.clone(resume) : null;
  }

  override save(resume: Resume): Promise<Resume> {
    return this.enqueueMutation(async () => {
      const database = await this.loadDatabase();
      const saved = this.clone(resume);
      const index = database.resumes.findIndex((item) => item.id === saved.id);

      if (index >= 0) {
        database.resumes[index] = saved;
      } else {
        database.resumes.push(saved);
      }

      await this.persist(database);
      return this.clone(saved);
    });
  }

  override duplicate(id: string): Promise<Resume> {
    return this.enqueueMutation(async () => {
      const database = await this.loadDatabase();
      const source = database.resumes.find((resume) => resume.id === id);
      if (!source) {
        throw new Error('Currículo não encontrado para duplicação.');
      }

      const timestamp = new Date().toISOString();
      const duplicate: Resume = {
        ...this.clone(source),
        id: crypto.randomUUID(),
        title: `${source.title} — cópia`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      database.resumes.push(duplicate);
      await this.persist(database);
      return this.clone(duplicate);
    });
  }

  override delete(id: string): Promise<void> {
    return this.enqueueMutation(async () => {
      const database = await this.loadDatabase();
      const resumes = database.resumes.filter((resume) => resume.id !== id);

      if (resumes.length !== database.resumes.length) {
        await this.persist({ ...database, resumes });
      }
    });
  }

  private async loadDatabase(): Promise<LocalDatabase> {
    const stored = await this.storage.get(LOCAL_DATABASE_KEY);
    if (!stored) {
      return this.emptyDatabase();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(stored);
    } catch {
      throw new Error('Não foi possível ler os currículos salvos.');
    }

    return this.migrate(parsed);
  }

  private migrate(value: unknown): LocalDatabase {
    if (!this.isRecord(value)) {
      throw new Error('O armazenamento local possui formato inválido.');
    }

    const version = value['schemaVersion'];
    const resumes = value['resumes'];

    if (!Number.isInteger(version) || !Array.isArray(resumes)) {
      throw new Error('O armazenamento local possui formato inválido.');
    }

    if (version !== CURRENT_SCHEMA_VERSION) {
      throw new Error('A versão dos dados locais não é compatível com o app.');
    }

    if (!resumes.every((resume) => this.isResume(resume))) {
      throw new Error('Um currículo salvo possui formato inválido.');
    }

    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      resumes: resumes.map((resume) => this.clone(resume as Resume)),
    };
  }

  private async persist(database: LocalDatabase): Promise<void> {
    await this.storage.set(
      LOCAL_DATABASE_KEY,
      JSON.stringify({
        schemaVersion: CURRENT_SCHEMA_VERSION,
        resumes: database.resumes,
      } satisfies LocalDatabase),
    );
  }

  private emptyDatabase(): LocalDatabase {
    return { schemaVersion: CURRENT_SCHEMA_VERSION, resumes: [] };
  }

  private clone<T>(value: T): T {
    return structuredClone(value);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isResume(value: unknown): value is Resume {
    if (!this.isRecord(value)) {
      return false;
    }

    const personalInfo = value['personalInfo'];
    return Boolean(
      typeof value['id'] === 'string' &&
        typeof value['title'] === 'string' &&
        typeof value['language'] === 'string' &&
        this.isRecord(personalInfo) &&
        typeof personalInfo['fullName'] === 'string' &&
        Array.isArray(value['experiences']) &&
        Array.isArray(value['education']) &&
        Array.isArray(value['skills']) &&
        Array.isArray(value['languages']) &&
        Array.isArray(value['courses']) &&
        typeof value['templateId'] === 'string' &&
        typeof value['createdAt'] === 'string' &&
        typeof value['updatedAt'] === 'string',
    );
  }

  private enqueueMutation<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationQueue.then(operation, operation);
    this.mutationQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
}
