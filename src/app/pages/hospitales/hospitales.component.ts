import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospitales/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {

  cargando: boolean = true;
  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  imgSubscribe: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalUploadService: ModalUploadService,
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this.imgSubscribe = this.modalUploadService.notificacion
      .pipe(
        delay(300)
      )
      .subscribe(() => {
        this.cargarHospitales();
      })
  }

  ngOnDestroy (){
    this.imgSubscribe.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe(result => {
        this.hospitales = result.hospitales;
        this.totalRegistros = result.total;
        this.cargando = false;;
      });
  }

  async crearHospital() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })
    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((hospital: any) => {
          this.hospitales.push(hospital.hospital)
        })
    }
  }

  buscarHospitales(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this.hospitalService.buscarHospitales(termino)
      .subscribe((hospitales: any) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  actualizarHospital(hospital: Hospital) {
    this.cargando = true;
    this.hospitalService.actualizarHospital(hospital).
      subscribe(res => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
        this.cargando = false;
      }, 
      (err) => {
        Swal.fire('Error al actualizar', err, 'error');
        this.cargando = false;
      }
      );
  }

  borrarHospital(hospital: Hospital) {
    this.cargando = true;
    this.hospitalService.borrarHospital(hospital._id).
      subscribe(() => {
        this.cargarHospitales();
        Swal.fire('Eliminado', hospital.nombre, 'success');
      }, (err) => {
        Swal.fire('Error al eliminar', err, 'error');
        this.cargando = false;
      });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
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
    this.cargarHospitales();
  }

}
