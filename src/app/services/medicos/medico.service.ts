import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import Swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService) {

  }

  cargarMedicos(desde: number = 0) {
    let url = base_url + '/medicos';
    return this.http.get(url);
  }

  cargarMedico(id: string) {
    let url = base_url + '/medicos/' + id;
    return this.http.get(url);
  }

  guardarMedico(medico: {nombre: string, hospital: string}) {
    let url = base_url + '/medicos';
    return this.http.post(url, medico);
  }

  actualizarMedico(medico: Medico) {
    let url = base_url + '/medicos/' + medico._id;
    return this.http.put(url, medico);
  }

  borrarMedico(id: string) {
    let url = base_url + '/medicos/' + id;
    return this.http.delete(url);
  }

  buscarMedicos(termino: string) {
    let url = base_url + '/todo/medicos/' + termino;
    return this.http.get(url)
      .map((resp: any) => resp.medicos);
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // get headers() {
  //   return {
  //     headers: {
  //       'x-token': this.token
  //     }
  //   }
  // }

}
