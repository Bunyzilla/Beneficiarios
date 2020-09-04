import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RecordsComponent } from './records/records.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { SettingsComponent } from './settings/settings.component';

export const DashboardRoutes: Routes = [
  { path: '', redirectTo: '/dashboard/admin/home', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Inicio',
          urls: [
            { title: 'Inicio', url: '/dashboard/home' },
            { title: 'Inicio'}
          ]
        }
      },
      {
        path: 'records',
        component: RecordsComponent,
        data: {
          title: 'expedientes',
          urls: [
            { title: 'expedientes', url: '/dashboard/records' },
            { title: 'expedientes'}
          ]
        }
      }
      ,
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'perfil',
          urls: [
            { title: 'perfil', url: '/dashboard/profile' },
            { title: 'perfil'}
          ]
        }
      },
      {
        path: 'add-profile',
        component: AddProfileComponent,
        data: {
          title: 'nuevoperfil',
          urls: [
            { title: 'nuevoperfil', url: '/dashboard/add-profile' },
            { title: 'nuevoperfil'}
          ]
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'ajustes',
          urls: [
            { title: 'ajustes', url: '/dashboard/settings' },
            { title: 'ajustes'}
          ]
        }
      }
    ]
  }
];
