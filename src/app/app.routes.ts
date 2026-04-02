import { Routes } from '@angular/router';

/**
 * Configuración de rutas de la aplicación.
 *
 * Utiliza carga diferida (`loadComponent`) para reducir el tamaño
 * del bundle inicial. El `LayoutComponent` envuelve todas las vistas hijas.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage)
      },
      {
        path: 'categories',
        loadComponent: () => import('./categories/categories.page').then((m) => m.CategoriesPage)
      }
    ]
  }
];
