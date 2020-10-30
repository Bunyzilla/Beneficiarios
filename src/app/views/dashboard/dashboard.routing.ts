import { AddExpComponent } from './add-exp/add-exp.component';
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RecordsComponent } from './records/records.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';

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
        path: 'profile/:idBeneficiary',
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
        path: 'add-exp',
        component: AddExpComponent,
        data: {
          title: 'nuevoperfil',
          urls: [
            { title: 'nuevoperfil', url: '/dashboard/add-profile' },
            { title: 'nuevoperfil'}
          ]
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'users',
          urls: [
            { title: 'users', url: '/dashboard/users' },
            { title: 'users'}
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
