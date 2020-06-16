import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.css']
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTmp: string | ArrayBuffer;

  constructor(
    public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTmp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return
    }

    if (archivo.type.indexOf('image') < 0) {
      swal("Solo imagenes", "el archivo selleccionado debe ser una imagen", 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImgTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTmp = reader.result;
  }

  subirImagen() {
    this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then(resp => {
        this.modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      }).catch(err => {
        console.log('error en la carga ' + err)
      });
  }

}
