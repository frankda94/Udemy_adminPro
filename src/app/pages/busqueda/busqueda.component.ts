import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';
import { environment } from 'src/environments/environment';

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
    let url = environment.base_url + '/todo/' + termino;
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
