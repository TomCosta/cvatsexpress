import { inject, Injectable } from '@angular/core';

import { AppLanguageService } from '../i18n/app-language.service';
import { createLocalId } from '../models/local-id';
import { createEmptyResume, type Resume } from '../models/resume.model';
import { ResumeRepository } from '../repositories/resume.repository';

@Injectable({ providedIn: 'root' })
export class CreateResumeService {
  private readonly i18n = inject(AppLanguageService);
  private readonly repository = inject(ResumeRepository);

  create(): Promise<Resume> {
    const resume = createEmptyResume(
      createLocalId(),
      this.i18n.language(),
      new Date(),
      this.i18n.t('editor.defaultTitle'),
    );
    return this.repository.save(resume);
  }
}
