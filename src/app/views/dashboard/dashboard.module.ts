import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { DashboardRoutes } from './dashboard.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//Views - Administrator Dashboard
import { HomeComponent } from './home/home.component';
import { RecordsComponent } from './records/records.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddExpComponent } from './add-exp/add-exp.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'
 
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

//Components


@NgModule({
    imports: [
        NgxMaskModule.forRoot(),
        NgbModule,//Es importante que este arriba si no no funciona
        FormsModule,
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        NgMultiSelectDropDownModule.forRoot(),
    ],
    declarations: [
        //Views - Administrator Dashboard
        HomeComponent,
        RecordsComponent,
        ProfileComponent,
        AddProfileComponent,
        SettingsComponent,
        UsersComponent,
        AddExpComponent,

        //Componentes del dashboard

    ]
})
export class DashboardModule { }
