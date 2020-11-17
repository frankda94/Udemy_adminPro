import { Injectable, NgZone } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
//rxjs
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { RegisterForm } from '../../interfaces/register-form.interfaces';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../../interfaces/login-form.interfaces';

//numero de video tutorial en el que voy 194
const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  menu: any[] = [];
  public auth2: any;



  constructor(
    private http: HttpClient,
    private router: Router,
    private SubirArchivoService: SubirArchivoService,
    private ngZone: NgZone) {
    this.googleInit();
    // this.cargarStorage();
  }

  // cargarStorage() {
  //   if (localStorage.getItem('token')) {
  //     this.token = localStorage.getItem('token');
  //     this.usuario = JSON.parse(localStorage.getItem('usuario'));
  //     this.menu = JSON.parse(localStorage.getItem('menu'));
  //   } else {
  //     this.token = '';
  //     this.usuario = null;
  //     this.menu = [];
  //   }
  // }

  googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '999729721945-o8ibql5lhh66b9gis11a1fv3e45baimp.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })
  }



  guardarTokenAndMenuStorage(token: string, menu: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  loginGoogle(token: string) {

    let url = base_url + '/login/google';
    let options = {
      headers: {
        'g-token': token
      }
    };
    return this.http.post(url, null, options).
      map((resp: any) => {
        this.guardarTokenAndMenuStorage(resp.token, resp.menu);
        return true;
      });
  }


  validarToken(): Observable<boolean> {

    let url = base_url + '/login/renewToken';

    return this.http.get(url).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, role, google, uid);
        this.guardarTokenAndMenuStorage(resp.token, resp.menu)
        return true;
      }),
    ).pipe(
      catchError(err => of(false))
    );
  }

  login(usuarioLogin: LoginForm, remember: boolean) {

    if (remember) {
      localStorage.setItem('recordarme-email', usuarioLogin.email)
    } else {
      localStorage.removeItem('recordarme-email');
    }

    let url = base_url + '/login';
    return this.http.post(url, usuarioLogin)
    .map((resp: any) => {
        this.guardarTokenAndMenuStorage(resp.token, resp.menu);
        return true;
      }).
      pipe(catchError(err => {
        Swal.fire('error', err.error.mensaje, 'error');
        return throwError(err);
      }))
  }

  logout() {
    localStorage.clear();
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(["/login"]);
      })
    })
  }

  crearUsuario(usuarioForm: RegisterForm) {
    let url = base_url + '/usuarios';
    return this.http.post(url, usuarioForm)
      .pipe(
        tap((resp: any) => {
          this.guardarTokenAndMenuStorage(resp.token, resp.menu);
          Swal.fire('Usuario creado', usuarioForm.email, 'success');
          return resp.usuario;
        })
      ).pipe(
        catchError(err => {
          Swal.fire('error', err.error.mensaje, 'error');
          return throwError(err);
        })
      )
  }

  actualizarUsuario(usuario: Usuario) {

    let url = base_url + `/usuarios/${this.uid}`;

    return this.http.put(url, usuario).
      map((resp: any) => {
        if (usuario._id === this.usuario._id) {
          let usuarioDB: Usuario = resp.usuario;
        }
        Swal.fire('Usuario actualizado', usuario.nombre, 'success');
        return true;
      }).pipe(
        catchError(err => {
          Swal.fire( "error en la actualización",err.error.mensaje, 'error');
          return throwError(err);
        })
      )
  }

  actualizarRol (usuario: Usuario){
    let url = base_url + `/usuarios/${usuario._id}`;
    return this.http.put(url, usuario)
      .pipe(
        catchError(err => {
          Swal.fire( "error en la actualización",err.error.mensaje, 'error');
          return throwError(err);
        })
      )
  }

  cambiarImagen(archivo: File, id: string) {
    this.SubirArchivoService.subirArchivo(archivo, 'usuarios', id).then(
      (resp: any) => {
        this.usuario.img = resp
        Swal.fire('Imagen actualizada correctamente !', this.usuario.nombre, 'success');;
      }
    ).catch(err => {
      console.log(err);
    });
  }

  cargarUsuarios(desde: number = 0) {
    let url = base_url + '/usuarios?desde=' + desde;
    return this.http.get<any>(url)
      .pipe(
        // delay(500),
        map ( resp => {
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.role, user.google, user.uid));
          return {
            total: resp.total,
            usuarios
          }
        })
      )
  }

  buscarUsuarios( tipo: 'usuarios'|'medicos'|'hospitales',
     termino: string) {
    let url = base_url + '/todo/usuarios/' + termino;
    return this.http.get(url)
      .pipe (
        map((resp: any) => {
          switch (tipo){
            case 'usuarios':
              return this.transformarUsuarios(resp.usuarios)
          }
        })
      )
  }

  borrarUsuario(id: string) {
    let url = base_url + '/usuarios/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
      .map(() => {
        Swal.fire('Usuario borrado', `el usuario ${id} ha sido eliminado correctamente`, 'success')
        return true;
      });
  }

  private transformarUsuarios (resultados: any []): Usuario []{
    return  resultados.map (
      user => new Usuario(user.nombre, user.email, '', user.img, user.role, user.google, user.uid));
  }

  get uid(): string {
    return this.usuario._id || '';
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }


  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

}
