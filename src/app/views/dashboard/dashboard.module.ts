import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { DashboardRoutes } from './dashboard.routing';

//Views - Administrator Dashboard
import { HomeComponent } from './home/home.component';
import { RecordsComponent } from './records/records.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';

//Components


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
    ],
    declarations: [
        //Views - Administrator Dashboard
        HomeComponent,
        RecordsComponent,
        ProfileComponent,
        AddProfileComponent,
        SettingsComponent,
        UsersComponent,

        //Componentes del dashboard

    ]
})
export class DashboardModule { }
