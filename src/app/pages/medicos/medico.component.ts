import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, MedicoService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', null, '', null, '');
  hospital: Hospital = new Hospital('');
  titulo: string = '';


  constructor(
    public hospitalService: HospitalService,
    public medicoService: MedicoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id !== 'nuevo') {
        this.cargarMedico(id);
        this.titulo = 'Actualizar médico'
      } else {
        this.titulo = 'Crear médico'
      }
    });
  }

  ngOnInit() {

    this.cargarHospitales();
    this.modalUploadService.notificacion
      .subscribe(resp => {
        this.medico.img = resp.medico.img;
      });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales: any) => this.hospitales = hospitales.hospitales);
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return
    }

    this.validarEstado()
      .subscribe(medico => {
        this.router.navigate(['/dashboard/medicos']);
      })

  }

  validarEstado() {
    if (this.titulo == 'Actualizar médico') {
      return this.medicoService.actualizarMedico(this.medico);
    } else {
      let medico = {nombre: this.medico.nombre, hospital: this.hospital._id}
      /**
       * destructuracion de array
      // const {nombre, hospital} = this.medico;
      // this.medico = {nombre, hospital};

      //añadir datos a destructuracion
      /**
       * const data = {
       *    ...this.form.value
       *    _id: this.id
       * }
       */

      return this.medicoService.guardarMedico(medico);
    }
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico(id)
      .subscribe((resp: any) => {
        this.medico = resp.medico;
        this.hospital = resp.medico.hospital;
      });
  }

  cambiarHospital(id: string) {
    this.hospital = this.hospitales.find(h => h._id === id);
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
