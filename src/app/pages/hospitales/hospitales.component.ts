import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospitales/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit {

  cargando: boolean = true;
  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  constructor(
    private hospitalService: HospitalService,
    private modalUploadService: ModalUploadService,
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion
      .subscribe(resp => {
        this.cargarHospitales();
      })
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde, 3)
      .subscribe((result: any) => {
        this.hospitales = result.hospitales;
        this.totalRegistros = result.total;
        this.cargando = false;;
      });
  }

  crearHospital() {
    swal({
      title: 'crear hospital',
      text: 'Ingrese el nombre del hospital',
      content: { element: "input" },
      icon: 'info',
      buttons: ['cancelar', 'crear'],
      dangerMode: true
    }).then((valor) => {
      if (!valor || valor.length === 0) {
        return;
      }
      this.hospitalService.crearHospital(valor)
        .subscribe(resp => { this.cargarHospitales() })
    })
  }

  buscarHospitales(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this.hospitalService.buscarHospital(termino)
      .subscribe((hospitales: any) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  actualizarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital).
      subscribe(res => {
      });
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: "Estas seguro de eliminar el hospital",
      text: 'Una vez eliminado el hospital ' + hospital.nombre + ' no podrá ser recuperado',
      icon: 'warning',
      buttons: ['aceptar', 'cancelar'],
      dangerMode: true,
    }).then(borrar => {
      if (!borrar) {
        this.hospitalService.borrarHospital(hospital._id).
          subscribe(res => {
            this.cargarHospitales();
          });
      }
    })
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
