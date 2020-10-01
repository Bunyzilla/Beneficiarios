import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layout para crear una capa donde se renderizan dentro otras vistas
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

//Vistas de las paginas con carga normal
import { LoginComponent } from './views/login/login.component';
import { NotfoundComponent } from './views/404/not-found.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { ForgotpasswordComponent } from './views/forgotpassword/forgotpassword.component';


export const Approutes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        //Se carga de esta manera porque dentro del modulo del dashboard vienen componentes que
        //se comparten y pueden usar en las vistas dentro del modulo
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'landing-page',
        component: LandingPageComponent
      },
      {
        path: 'forgotpassword',
        component: ForgotpasswordComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '404',
        component: NotfoundComponent
      },
    ]
  },
  //Redireccionamiento en caso de que no exista la ruta
  {
    path: '**',
    redirectTo: '404'
  }
];
