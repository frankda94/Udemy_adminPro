import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuarios/usuario.service';
import swal from 'sweetalert';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService) {

  }

  cargarMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;
    return this.http.get(url);
  }

  cargarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url);
  }

  buscarMedicos(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medico/' + termino;
    return this.http.get(url)
      .map((resp: any) => resp.medico);
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += "?token=" + this.usuarioService.token;
    return this.http.delete(url).
      map(resp => {
        swal("Medico borrado", "medico borrado correctamente! ", "success");
        return resp;
      });

  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    //actualizando
    if (medico._id) {
      url += '/' + medico._id;
      url += "?token=" + this.usuarioService.token;
      return this.http.put(url, medico).
        map((resp: any) => {
          swal('Medico actualizado', medico.nombre, 'success')
          return resp.medico;
        });

    } else {
      //creando
      url += "?token=" + this.usuarioService.token;
      return this.http.post(url, medico).
        map((resp: any) => {
          swal('Medico creado', medico.nombre, 'success')
          return resp.medico;
        });
    }

  }

}
