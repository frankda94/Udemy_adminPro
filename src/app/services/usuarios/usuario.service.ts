import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private SubirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  estaLogueado() {
    return (this.token.length > 1) ? true : false;
  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token }).
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      });
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(["/login"]);
  }

  login(usuario: Usuario, recuerdame: boolean) {

    if (recuerdame) {
      localStorage.setItem('recordarme-email', usuario.email)
    } else {
      localStorage.removeItem('recordarme-email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
      .map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      });
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
      .map((resp: any) => {
        swal('Usuario creado', usuario.email, 'success');

        return resp.usuario;
      });
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario).
      map((resp: any) => {
        let usuarioDB: Usuario = resp.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
        swal('Usuario actualizado', usuario.nombre, 'success');
        return true;
      });
  }

  cambiarImagen(archivo: File, id: string) {
    this.SubirArchivoService.subirArchivo(archivo, 'usuarios', id).then(
      (resp: any) => {
        this.usuario.img = resp.usuario.img;
        swal('Imagen actualizada correctamente !', this.usuario.nombre, 'success');;
        this.guardarStorage(id, this.token, this.usuario);
      }
    ).catch(err => {
      console.log(err);
    });
  }

}
