import { NgModule } from "@angular/core";
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    declarations: [
        BreadcrumbsComponent,
        HeaderComponent,
        NoPageFoundComponent,
        SidebarComponent
    ],
    exports: [
        BreadcrumbsComponent,
        HeaderComponent,
        NoPageFoundComponent,
        SidebarComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        PipesModule
    ]
})

export class SharedModule { }