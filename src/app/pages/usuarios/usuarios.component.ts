import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  imgSubs: Subscription;
  usuarios: Usuario[] = [];
  usuariosTmp: Usuario[] = [];
  desde: number = 0;
  cargando: boolean = true;
  totalRegistros: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService,
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.imgSubs = this.modalUploadService.notificacion
      .pipe(
        delay(300)
      )
      .subscribe(img => {
        console.log(img);
        this.cargarUsuarios();
      })
  }

  ngOnDestroy(){
    //prevenir fugas de memoria
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe((result: any) => {
        this.totalRegistros = result.total;
        this.usuarios = result.usuarios;
        this.usuariosTmp = result.usuarios;
        this.cargando = false;
      })
  }

  cambiarDesde(valor: number) {

    let desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuarios(termino: string) {

    if (termino.length === 0) {
      return this.usuarios = this.usuariosTmp;
    }

    this.cargando = true;
    this.usuarioService.buscarUsuarios("usuarios",termino)
      .subscribe((usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire('No se puede borrar usuario', 'no se puede borrar así mismo', 'error')
      return;
    }
      Swal.fire({
      title: "Estas seguro de eliminar el usuario",
      text: 'Una vez eliminado el usuario ' + usuario.nombre + ' no podrá ser recuperado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!'
    }).then(borrar => {
      if (borrar.isConfirmed) {
        this.usuarioService.borrarUsuario(usuario._id)
          .subscribe(() => {
            this.cargarUsuarios();
          })
      }
    })
  }

  actualizarRoleUsuario(usuario: Usuario) {
    
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.actualizarRol(usuario).subscribe(resp => 
      console.log(resp));
  }

}
