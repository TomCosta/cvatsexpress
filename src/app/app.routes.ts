import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    data: { titleKey: 'route.home' },
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'resumes',
    data: { titleKey: 'route.resumes' },
    loadComponent: () =>
      import('./features/my-resumes/my-resumes.page').then(
        (m) => m.MyResumesPage,
      ),
  },
  {
    path: 'resume/:id/edit',
    data: { titleKey: 'route.editResume' },
    loadComponent: () =>
      import('./features/resume-editor/resume-editor.page').then(
        (m) => m.ResumeEditorPage,
      ),
  },
  {
    path: 'resume/:id/preview',
    data: { titleKey: 'route.previewResume' },
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
