import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public router: Router
  ) {
    activatedRoute.params.
      subscribe(params => {
        let termino = params['termino'];
        this.buscar(termino);
        console.log(termino)
      })
  }

  buscar(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;
    this.http.get(url).
      subscribe((result: any) => {
        this.usuarios = result.usuarios;
        this.medicos = result.medicos;
        this.hospitales = result.hospitales;
      })
  }

  ngOnInit() {
  }


}
