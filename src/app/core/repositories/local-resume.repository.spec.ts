import { createEmptyResume } from '../models/resume.model';
import { KeyValueStorage } from '../storage/key-value.storage';
import {
  LOCAL_DATABASE_KEY,
  LocalResumeRepository,
} from './local-resume.repository';

class MemoryStorage extends KeyValueStorage {
  readonly values = new Map<string, string>();
  writeDelay = 0;

  override async get(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  override async set(key: string, value: string): Promise<void> {
    if (this.writeDelay) {
      await new Promise((resolve) => setTimeout(resolve, this.writeDelay));
    }
    this.values.set(key, value);
  }

  override async remove(key: string): Promise<void> {
    this.values.delete(key);
  }
}

describe('LocalResumeRepository', () => {
  let storage: MemoryStorage;
  let repository: LocalResumeRepository;

  beforeEach(() => {
    storage = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [
        LocalResumeRepository,
        { provide: KeyValueStorage, useValue: storage },
      ],
    });
    repository = TestBed.inject(LocalResumeRepository);
  });

  it('saves and retrieves a resume with schema version', async () => {
    const resume = createEmptyResume('resume-1', 'pt-BR');
    resume.personalInfo.fullName = 'Ana Silva';

    await repository.save(resume);

    expect((await repository.findById('resume-1'))?.personalInfo.fullName).toBe(
      'Ana Silva',
    );
    expect(JSON.parse(storage.values.get(LOCAL_DATABASE_KEY) ?? '{}')).toEqual(
      jasmine.objectContaining({ schemaVersion: 1 }),
    );
  });

  it('updates an existing resume without creating another item', async () => {
    const resume = createEmptyResume('resume-1', 'pt-BR');
    await repository.save(resume);
    resume.title = 'Currículo Front-end';
    await repository.save(resume);

    expect((await repository.list()).length).toBe(1);
    expect((await repository.list())[0].title).toBe('Currículo Front-end');
  });

  it('duplicates a resume with a new id and title', async () => {
    const resume = createEmptyResume('resume-1', 'pt-BR');
    await repository.save(resume);

    const duplicate = await repository.duplicate(resume.id);

    expect(duplicate.id).not.toBe(resume.id);
    expect(duplicate.title).toContain('cópia');
    expect((await repository.list()).length).toBe(2);
  });

  it('deletes a saved resume', async () => {
    const resume = createEmptyResume('resume-1', 'pt-BR');
    await repository.save(resume);

    await repository.delete(resume.id);

    expect(await repository.findById(resume.id)).toBeNull();
  });

  it('returns an empty collection when no database exists', async () => {
    expect(await repository.list()).toEqual([]);
  });

  it('rejects a schema from a newer app version', async () => {
    storage.values.set(
      LOCAL_DATABASE_KEY,
      JSON.stringify({ schemaVersion: 99, resumes: [] }),
    );

    await expectAsync(repository.list()).toBeRejectedWithError(
      /não é compatível/,
    );
  });

  it('rejects an older schema when no explicit migration exists', async () => {
    storage.values.set(
      LOCAL_DATABASE_KEY,
      JSON.stringify({ schemaVersion: 0, resumes: [] }),
    );

    await expectAsync(repository.list()).toBeRejectedWithError(
      /não é compatível/,
    );
  });

  it('rejects malformed resumes instead of relabeling the schema', async () => {
    storage.values.set(
      LOCAL_DATABASE_KEY,
      JSON.stringify({ schemaVersion: 1, resumes: [{ id: 'broken' }] }),
    );

    await expectAsync(repository.list()).toBeRejectedWithError(
      /currículo salvo possui formato inválido/,
    );
  });

  it('serializes concurrent saves without losing a resume', async () => {
    storage.writeDelay = 10;
    const first = createEmptyResume('resume-1', 'pt-BR');
    const second = createEmptyResume('resume-2', 'pt-BR');

    await Promise.all([repository.save(first), repository.save(second)]);

    expect((await repository.list()).map((resume) => resume.id).sort()).toEqual([
      'resume-1',
      'resume-2',
    ]);
  });
});
import { TestBed } from '@angular/core/testing';
