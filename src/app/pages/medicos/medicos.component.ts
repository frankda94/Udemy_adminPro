import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../services/medicos/medico.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ],
})
export class MedicosComponent implements OnInit, OnDestroy {

  imgSubscribe: Subscription;
  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public medicoService: MedicoService,
    private modalUploadService: ModalUploadService,) { }

  ngOnInit() {
    this.cargarMedicos();
    this.imgSubscribe = this.modalUploadService.notificacion
      .pipe(
        delay(300)
      )
      .subscribe(() => {
        this.cargarMedicos();
      })
  }

  ngOnDestroy() {
    this.imgSubscribe.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde).
      subscribe((resp: any) => {
        this.medicos = resp.medicos
        this.totalRegistros = this.medicos.length;
        this.cargando = false;
      });
  }

  buscarMedico(termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.medicoService.buscarMedicos(termino)
      .subscribe(medicos => {
        this.medicos = medicos;
        this.cargando = false
      });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('medicos', id);
  }


  borrarMedico(medico: Medico) {
    this.cargando = true;
    this.medicoService.borrarMedico(medico._id).
      subscribe(() => {
        this.cargarMedicos();
        Swal.fire('Eliminado', medico.nombre, 'success');
      }, (err) => {
        Swal.fire('Error al eliminar', err, 'error');
        this.cargando = false;
      });
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
    this.cargarMedicos();
  }

}
