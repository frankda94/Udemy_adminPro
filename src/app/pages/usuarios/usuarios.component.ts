import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import swal from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  cargando: boolean = true;
  totalRegistros: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService,
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
      .subscribe(resp => {
        this.cargarUsuarios();
      })
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe((result: any) => {
        this.totalRegistros = result.total;
        this.usuarios = result.usuarios;
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

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;
    this.usuarioService.buscarUsuarios(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      swal('No se puede borrar usuario', 'no se puede borrar así mismo', 'error')
      return;
    }
    swal({
      title: "Estas seguro de eliminar el usuario",
      text: 'Una vez eliminado el usuario ' + usuario.nombre + ' no podrá ser recuperado',
      icon: 'warning',
      buttons: ['aceptar', 'cancelar'],
      dangerMode: true,
    }).then(borrar => {
      if (!borrar) {
        this.usuarioService.borrarUsuario(usuario._id)
          .subscribe(borrado => {
            this.cargarUsuarios();
          })
      }
    })
  }

  actualizarRoleUsuario(usuario: Usuario) {
    this.usuarioService.actualizarUsuario(usuario)
      .subscribe(res => {
      })
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

}
