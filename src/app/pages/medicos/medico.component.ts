import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, MedicoService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', null, '', '', '');
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
    this.hospitalService.cargarHospitales().
      subscribe((hospitales: any) => this.hospitales = hospitales.hospitales);

    this.modalUploadService.notificacion.
      subscribe(resp => {
        this.medico.img = resp.medico.img;
      });
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return
    }
    this.medicoService.guardarMedico(this.medico).
      subscribe(medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id]);
      })
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico(id).
      subscribe((medico: any) => {
        this.medico = medico.medico
        this.medico.hospital = medico.medico.hospital._id;
        this.cambiarHospital(this.medico.hospital);
      });
  }

  cambiarHospital(id: string) {
    this.hospitalService.obtenerHospital(id).
      subscribe((res: any) => {
        this.hospital = res.hospital;
      });
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
