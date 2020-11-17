import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ],
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTmp: string | ArrayBuffer;
  constructor(private usuarioService: UsuarioService) {

  }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
  }

  actualizarUsuario(usuario: Usuario) {

    this.usuario.nombre = usuario.nombre;

    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }

    this.usuarioService.actualizarUsuario(this.usuario).subscribe(resp => {
      console.log(resp)
    });
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire("Solo imagenes", "el archivo selleccionado debe ser una imagen", 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTmp = reader.result;
  }

  cambiarImagen() {
    this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
