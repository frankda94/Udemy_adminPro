import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
  }
}
