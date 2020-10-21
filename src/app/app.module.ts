import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    CommonModule,
    LocationStrategy,
    HashLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NavigationComponent } from './components/header-navigation/navigation.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './views/login/login.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { ForgotpasswordComponent } from './views/forgotpassword/forgotpassword.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
    declarations: [
        AppComponent,
        //Layouts
        FullComponent,
        BlankComponent,
        //Components
        NavigationComponent,
        BreadcrumbComponent,
        SidebarComponent,
        //Pages
        LoginComponent,
        LandingPageComponent,
        ForgotpasswordComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        RouterModule.forRoot(Approutes, { useHash: false }),
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
