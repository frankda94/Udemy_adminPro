import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ],
})
export class HeaderComponent implements OnInit {

  usuario: Usuario
  imagenUrl: ''

  constructor(
    public usuarioService: UsuarioService,
    public router: Router) { }

  buscar(termino: string) {
    this.router.navigate(["dashboard/busqueda", termino])
  }


  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
  }

}
