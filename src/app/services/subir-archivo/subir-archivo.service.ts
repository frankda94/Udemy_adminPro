import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() {

  }
  async subirArchivo(archivo: File, tipo: string, id: string) {

    try {
       const url = base_url + '/uploads/' + tipo + '/' + id;
       console.log(url);
       
        let formData = new FormData();
  
        formData.append('imagen', archivo);

        const  resp = await fetch (url, {
          method: 'PUT',
          headers: {
            'x-token': localStorage.getItem('token') || ''
          },
          body: formData
        })
       const data = await resp.json();
       if (data.ok){
         return data.nombreArchivo
       }else{
         console.log(data.msg);
         return false;
       }
        
      }
       catch (error) {
      console.log(error);
      return false;
    }
  }
}
