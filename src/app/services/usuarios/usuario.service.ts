import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
//rxjs
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  estaLogueado() {
    return (this.token.length > 1) ? true : false;
  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token }).
      map((resp: any) => {
        console.log(resp);
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      });
  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;
    return this.http.get(url).
      map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        console.log("token renovado")
        return true;
      }).
      pipe(catchError(err => {
        this.router.navigate[('/login')];
        swal('no se ha validado autorización', 'no fue posible renovar token', 'error');
        return throwError(err);
      }))
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(["/login"]);
  }

  login(usuario: Usuario, recuerdame: boolean) {

    if (recuerdame) {
      localStorage.setItem('recordarme-email', usuario.email)
    } else {
      localStorage.removeItem('recordarme-email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }).
      pipe(catchError(err => {
        swal('error en el login', err.error.mensaje, 'error');
        return throwError(err);
      }))
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario).
      map((resp: any) => {
        swal('Usuario creado', usuario.email, 'success');

        return resp.usuario;
      }).pipe(
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      )
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario).
      map((resp: any) => {
        if (usuario._id === this.usuario._id) {
          let usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }
        swal('Usuario actualizado', usuario.nombre, 'success');
        return true;
      }).pipe(
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      )
  }

  cambiarImagen(archivo: File, id: string) {
    this.SubirArchivoService.subirArchivo(archivo, 'usuarios', id).then(
      (resp: any) => {
        this.usuario.img = resp.usuario.img;
        swal('Imagen actualizada correctamente !', this.usuario.nombre, 'success');;
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      }
    ).catch(err => {
      console.log(err);
    });
  }

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuario/' + termino;
    return this.http.get(url)
      .map((resp: any) => resp.usuario);
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
      .map(resp => {
        swal('Usuario borrado', 'el usuario ha sido eliminado correctamente', 'success')
        return true;
      });
  }

}
