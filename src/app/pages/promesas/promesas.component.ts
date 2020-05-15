import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ],
})
export class PromesasComponent implements OnInit {

  constructor() {
    this.contarSegundos().then(msj => console.log("termino ", msj),
    ).catch(error => {
      console.error("error en la promesa", error)
    })
  }

  ngOnInit() {
  }
  contarSegundos() {
    return new Promise((resolve, reject) => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador += 1;
        console.log(contador);
        if (contador === 3) {
          resolve('OK');
          // reject('simple error')
          clearInterval(intervalo);
        }
      }, 1000)
    });
  }
}