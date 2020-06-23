import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import {
  LoginGuardGuard,
  AdminGuard,
  VerificaTokenGuard,
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  HospitalService,
  MedicoService,
  SubirArchivoService
} from './service.index';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // HttpClient
  ],
  providers: [
    LoginGuardGuard,
    AdminGuard,
    VerificaTokenGuard,
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    HospitalService,
    MedicoService,
    SubirArchivoService,
    ModalUploadService
  ]

})
export class ServiceModule { }
