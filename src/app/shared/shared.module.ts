import { NgModule } from "@angular/core";
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        BreadcrumbsComponent,
        HeaderComponent,
        SidebarComponent,
        ModalUploadComponent
    ],
    exports: [
        BreadcrumbsComponent,
        HeaderComponent,
        SidebarComponent,
        ModalUploadComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        PipesModule,
        FormsModule
    ]
})

export class SharedModule { }