import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medicos/medico.service';
import { Medico } from 'src/app/models/medico.model';
import swal from 'sweetalert';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ],
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  constructor(public medicoService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos(this.desde).
      subscribe((resp: any) => {
        this.medicos = resp.medicos
        this.totalRegistros = resp.total;
      });

  }

  buscarMedico(termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.medicoService.buscarMedicos(termino).
      subscribe(medicos => this.medicos = medicos);
  }


  borrarMedico(medico: Medico) {
    swal({
      title: "Estas seguro de eliminar el médico",
      text: 'Una vez eliminado el médico ' + medico.nombre + ' no podrá ser recuperado',
      icon: 'warning',
      buttons: ['aceptar', 'cancelar'],
      dangerMode: true,
    }).then(borrar => {
      if (!borrar) {
        this.medicoService.borrarMedico(medico._id).
          subscribe(() => this.cargarMedicos());
      }
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
    this.cargarMedicos();
  }

}
