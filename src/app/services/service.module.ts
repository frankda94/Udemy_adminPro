import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import {
  SettingsService,
  SidebarService,
  SharedService,
  LoginGuardGuard,
  UsuarioService,
  SubirArchivoService
} from './service.index';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // HttpClient
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    LoginGuardGuard,
    UsuarioService,
    SubirArchivoService,
    ModalUploadService
  ]

})
export class ServiceModule { }
