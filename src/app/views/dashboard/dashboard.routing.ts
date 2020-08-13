import { Routes } from '@angular/router';

import { HomeComponent } from './admin/home/home.component';

export const DashboardRoutes: Routes = [
  { path: '', redirectTo: '/dashboard/admin/home', pathMatch: 'full' },
  {
    path: 'admin',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Inicio',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Inicio' }
          ]
        }
      },
    ]
  }
];
