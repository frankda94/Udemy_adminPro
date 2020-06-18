import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0, limit: number = 0) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    url += '&limit=' + limit;
    return this.http.get(url);
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url);
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this.usuarioService.token;
    return this.http.delete(url)
      .map(resp => {
        swal('Hospital borrado', 'el hospital ha sido eliminado correctamente', 'success')
        return true;
      });
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital';
    url += "?token=" + this.usuarioService.token;
    return this.http.post(url, { nombre })
      .map((resp: any) => {
        swal('Hospital creado', nombre, 'success');
        return resp;
      });
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += "?token=" + this.usuarioService.token;
    return this.http.put(url, hospital)
      .map((resp: any) => {
        swal('Hospital actualizado', resp.hospital.nombre, 'success');
      });
  }

  buscarHospital(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospital/' + termino;
    return this.http.get(url)
      .map((resp: any) => resp.hospital);
  }


}
