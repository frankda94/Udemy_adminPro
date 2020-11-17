import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
    name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

    transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {

        let url = environment.base_url + '/uploads/';

        if (!img) {
            return url + 'usuarios/xxx';
        }

        if (img.includes('https')) {
            return img;
        }

        switch (tipo) {
            case 'usuarios':
                return url += 'usuarios/' + img;
            case 'medicos':
                return url += 'medicos/' + img;
            case 'hospitales':
                return url += 'hospitales/' + img;
            default:
                return url += 'usuarios/xxx';
        }
    }

}
