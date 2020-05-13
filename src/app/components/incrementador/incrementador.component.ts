import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
})
export class IncrementadorComponent implements OnInit {

  //referencia a un elemento html
  @ViewChild('txtProgress') txtProgress: ElementRef;
  @Input() leyenda: string;
  @Input() porcentaje: number;

  @Output() cambioPorcentaje: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.porcentaje = 70;
    this.leyenda = 'Leyenda';
  }

  onChanges(newValue: number) {
    // obtener elemento por Nombre en el HTML 
    // let elementHtml: any = document.getElementsByName("porcentaje")[0];
    //  elementHtml.value   --> valor
    if (newValue >= 100) {
      this.porcentaje = 100;
    } else if (newValue <= 0) {
      this.porcentaje = 0;
    } else {
      this.porcentaje = newValue;
    }
    this.txtProgress.nativeElement.value = this.porcentaje;
    this.txtProgress.nativeElement.focus();
    this.cambioPorcentaje.emit(this.porcentaje);

  }

  cambiarPorcentaje(valor) {
    if (this.porcentaje + valor > 100) {
      return;
    }
    if (this.porcentaje + valor < 0) {
      return;
    }
    this.porcentaje += valor;
    this.cambioPorcentaje.emit(this.porcentaje);
  }

  ngOnInit(): void {
  }

}
