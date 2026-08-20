import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'CV ATS Express',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'resumes',
    title: 'Meus currículos — CV ATS Express',
    loadComponent: () =>
      import('./features/my-resumes/my-resumes.page').then(
        (m) => m.MyResumesPage,
      ),
  },
  {
    path: 'resume/new',
    title: 'Novo currículo — CV ATS Express',
    loadComponent: () =>
      import('./features/resume-editor/resume-editor.page').then(
        (m) => m.ResumeEditorPage,
      ),
  },
  {
    path: 'resume/:id/edit',
    title: 'Editar currículo — CV ATS Express',
    loadComponent: () =>
      import('./features/resume-editor/resume-editor.page').then(
        (m) => m.ResumeEditorPage,
      ),
  },
  {
    path: 'resume/:id/preview',
    title: 'Visualizar currículo — CV ATS Express',
    loadComponent: () =>
      import('./features/resume-preview/resume-preview.page').then(
        (m) => m.ResumePreviewPage,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
