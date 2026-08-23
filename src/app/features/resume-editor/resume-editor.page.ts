import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowDownOutline,
  arrowUpOutline,
  eyeOutline,
  trashOutline,
} from 'ionicons/icons';
import { concatMap, debounceTime, from } from 'rxjs';

import { AppLanguageService } from '../../core/i18n/app-language.service';
import { createLocalId } from '../../core/models/local-id';
import {
  normalizeLinkedInProfile,
  normalizeWebsite,
} from '../../core/models/profile-url';
import type {
  Course,
  Education,
  Experience,
  LanguageSkill,
  Resume,
  ResumeLanguage,
  Skill,
} from '../../core/models/resume.model';
import {
  hasEducationDraftContent,
  hasExperienceDraftContent,
} from '../../core/models/resume.model';
import { ResumeRepository } from '../../core/repositories/resume.repository';

const OPTIONAL_URL = /^$|^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

@Component({
  selector: 'app-resume-editor',
  standalone: true,
  templateUrl: './resume-editor.page.html',
  styleUrls: ['./resume-editor.page.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class ResumeEditorPage {
  private readonly fb = inject(FormBuilder);
  private readonly repository = inject(ResumeRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject(AppLanguageService);

  protected readonly loading = signal(true);
  protected readonly loadError = signal('');
  protected readonly saveState = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');
  protected resume: Resume | null = null;

  protected readonly form = this.fb.nonNullable.group({
    title: [this.i18n.t('editor.defaultTitle'), [Validators.required, Validators.maxLength(80)]],
    language: [this.i18n.language() as ResumeLanguage, Validators.required],
    personalInfo: this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', Validators.email],
      phone: [''],
      city: [''],
      state: [''],
      country: [''],
      linkedin: ['', Validators.pattern(OPTIONAL_URL)],
      portfolio: ['', Validators.pattern(OPTIONAL_URL)],
    }),
    targetRole: [''],
    professionalSummary: [''],
    experiences: this.fb.array<FormGroup>([]),
    education: this.fb.array<FormGroup>([]),
    skills: this.fb.array<FormGroup>([]),
    languages: this.fb.array<FormGroup>([]),
    courses: this.fb.array<FormGroup>([]),
  });

  constructor() {
    addIcons({
      addOutline,
      arrowDownOutline,
      arrowUpOutline,
      eyeOutline,
      trashOutline,
    });
    this.destroyRef.onDestroy(() => {
      void this.persist();
    });
    void this.initialize();
  }

  protected get experiences(): FormArray<FormGroup> {
    return this.form.controls.experiences;
  }

  protected get education(): FormArray<FormGroup> {
    return this.form.controls.education;
  }

  protected get skills(): FormArray<FormGroup> {
    return this.form.controls.skills;
  }

  protected get languages(): FormArray<FormGroup> {
    return this.form.controls.languages;
  }

  protected get courses(): FormArray<FormGroup> {
    return this.form.controls.courses;
  }

  protected addExperience(value?: Experience): void {
    this.experiences.push(
      this.fb.nonNullable.group({
        id: [value?.id ?? createLocalId()],
        company: [value?.company ?? ''],
        role: [value?.role ?? ''],
        location: [value?.location ?? ''],
        startDate: [value?.startDate ?? ''],
        endDate: [value?.endDate ?? ''],
        current: [value?.current ?? false],
        description: [value?.description ?? ''],
      }),
    );
  }

  protected addEducation(value?: Education): void {
    this.education.push(
      this.fb.nonNullable.group({
        id: [value?.id ?? createLocalId()],
        institution: [value?.institution ?? ''],
        course: [value?.course ?? ''],
        startDate: [value?.startDate ?? ''],
        endDate: [value?.endDate ?? ''],
        description: [value?.description ?? ''],
      }),
    );
  }

  protected addSkill(value?: Skill): void {
    this.skills.push(
      this.fb.nonNullable.group({
        id: [value?.id ?? createLocalId()],
        name: [value?.name ?? ''],
      }),
    );
  }

  protected addLanguage(value?: LanguageSkill): void {
    this.languages.push(
      this.fb.nonNullable.group({
        id: [value?.id ?? createLocalId()],
        language: [value?.language ?? ''],
        level: [value?.level ?? ''],
      }),
    );
  }

  protected addCourse(value?: Course): void {
    this.courses.push(
      this.fb.nonNullable.group({
        id: [value?.id ?? createLocalId()],
        name: [value?.name ?? ''],
        institution: [value?.institution ?? ''],
        year: [value?.year ?? ''],
      }),
    );
  }

  protected remove(array: FormArray, index: number): void {
    array.removeAt(index);
  }

  protected move(array: FormArray, index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= array.length) {
      return;
    }

    const control = array.at(index);
    array.removeAt(index);
    array.insert(target, control);
  }

  protected normalizeLinkedIn(): void {
    const control = this.form.controls.personalInfo.controls.linkedin;
    const normalized = normalizeLinkedInProfile(control.value);
    if (normalized !== control.value) {
      control.setValue(normalized);
    }
  }

  protected normalizePortfolio(): void {
    const control = this.form.controls.personalInfo.controls.portfolio;
    const normalized = normalizeWebsite(control.value);
    if (normalized !== control.value) {
      control.setValue(normalized);
    }
  }

  protected async openPreview(): Promise<void> {
    if (!this.resume) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (await this.persist()) {
      await this.router.navigate(['/resume', this.resume.id, 'preview']);
    }
  }

  async ionViewWillLeave(): Promise<void> {
    await this.persist();
  }

  protected saveMessage(): string {
    switch (this.saveState()) {
      case 'saving':
        return this.i18n.t('editor.saveSaving');
      case 'saved':
        return this.i18n.t('editor.saveSaved');
      case 'error':
        return this.i18n.t('editor.saveError');
      default:
        return this.i18n.t('editor.saveIdle');
    }
  }

  private async initialize(): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.loadError.set(this.i18n.t('editor.errorMissingId'));
        return;
      }

      const resume = await this.repository.findById(id);
      if (!resume) {
        this.loadError.set(this.i18n.t('editor.errorNotFound'));
        return;
      }

      this.resume = resume;
      this.populate(resume);
      this.form.valueChanges
        .pipe(
          debounceTime(650),
          concatMap(() => from(this.persist())),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } catch {
      this.loadError.set(this.i18n.t('editor.errorLoad'));
    } finally {
      this.loading.set(false);
    }
  }

  private populate(resume: Resume): void {
    this.form.patchValue({
      title: resume.title,
      language: resume.language,
      personalInfo: {
        fullName: resume.personalInfo.fullName,
        email: resume.personalInfo.email ?? '',
        phone: resume.personalInfo.phone ?? '',
        city: resume.personalInfo.city ?? '',
        state: resume.personalInfo.state ?? '',
        country: resume.personalInfo.country ?? '',
        linkedin: resume.personalInfo.linkedin ?? '',
        portfolio: resume.personalInfo.portfolio ?? '',
      },
      targetRole: resume.targetRole ?? '',
      professionalSummary: resume.professionalSummary ?? '',
    });
    resume.experiences.forEach((item) => this.addExperience(item));
    resume.education.forEach((item) => this.addEducation(item));
    resume.skills.forEach((item) => this.addSkill(item));
    resume.languages.forEach((item) => this.addLanguage(item));
    resume.courses.forEach((item) => this.addCourse(item));
  }

  private async persist(): Promise<boolean> {
    if (!this.resume) {
      return false;
    }

    this.saveState.set('saving');
    try {
      const value = this.form.getRawValue();
      const resume: Resume = {
        ...this.resume,
        title: value.title.trim() || this.i18n.t('editor.defaultTitle'),
        language: value.language,
        personalInfo: {
          fullName: value.personalInfo.fullName.trim(),
          email: this.optional(value.personalInfo.email),
          phone: this.optional(value.personalInfo.phone),
          city: this.optional(value.personalInfo.city),
          state: this.optional(value.personalInfo.state),
          country: this.optional(value.personalInfo.country),
          linkedin: this.optional(
            normalizeLinkedInProfile(value.personalInfo.linkedin),
          ),
          portfolio: this.optional(
            normalizeWebsite(value.personalInfo.portfolio),
          ),
        },
        targetRole: this.optional(value.targetRole),
        professionalSummary: this.optional(value.professionalSummary),
        experiences: (value.experiences as Experience[]).filter(
          hasExperienceDraftContent,
        ),
        education: (value.education as Education[]).filter(
          hasEducationDraftContent,
        ),
        skills: value.skills.filter((item) => item['name']?.trim()) as Skill[],
        languages: value.languages.filter(
          (item) => item['language']?.trim(),
        ) as LanguageSkill[],
        courses: value.courses.filter((item) => item['name']?.trim()) as Course[],
        updatedAt: new Date().toISOString(),
      };
      this.resume = await this.repository.save(resume);
      this.saveState.set('saved');
      return true;
    } catch {
      this.saveState.set('error');
      return false;
    }
  }

  private optional(value: string): string | undefined {
    return value.trim() || undefined;
  }
}
