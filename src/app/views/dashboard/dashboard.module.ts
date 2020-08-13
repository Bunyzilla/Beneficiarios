import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { DashboardRoutes } from './dashboard.routing';

//Views - Administrator Dashboard
import { HomeComponent } from './admin/home/home.component';

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
        
        //Componentes del dashboard
        
    ]
})
export class DashboardModule { }
