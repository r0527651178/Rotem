import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'ROTEM | רותם הדמיות אדריכליות' },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then((m) => m.About),
    title: 'אודות | ROTEM',
  },
  {
    path: 'gallery/:id',
    loadComponent: () => import('./gallery-page/gallery-page').then((m) => m.GalleryPage),
    // No static title: GalleryPage sets "<gallery> | ROTEM" itself. A route title would
    // overwrite it on every tab switch (?tab=… is a navigation too).
  },
  { path: '**', redirectTo: '' },
];
