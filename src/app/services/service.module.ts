import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    SubirArchivoService
  ]

})
export class ServiceModule { }
