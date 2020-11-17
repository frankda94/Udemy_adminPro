import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const url_base = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0) {
    let url = url_base + '/hospitales?desde=' + desde;
    return this.http.get(url)
      .pipe(
        map((resp: { total: number, hospitales: Hospital[] }) => {
          return {
            total: resp.total,
            hospitales: resp.hospitales,
          }
        })
      );
  }

  obtenerHospital(id: string) {
    let url = url_base + '/hospital/' + id;
    return this.http.get(url);
  }


  crearHospital(nombre: string) {
    const url = `${url_base}/hospitales`;
    return this.http.post(url, { nombre });
  }

  actualizarHospital(hospital: Hospital) {
    let url = url_base + '/hospitales/' + hospital._id;
    return this.http.put(url, hospital);
  }

  borrarHospital(id: string) {
    let url = url_base + '/hospitales/' + id;
    return this.http.delete(url);
  }

  buscarHospitales(termino: string) {
    let url = url_base + '/todo/hospitales/' + termino;
    return this.http.get(url)
      .map((resp: any) => resp.hospitales);
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


}
