import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ],
})
// INFORMACION ADICIOINAL DE RXJS http://reactivex.io/documentation/operators.html
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    //todo observador tiene un pipe 
    this.subscription = this.regresaObservable().pipe(
      //reintentos para llamar el observador
      retry(3)
    )
      .subscribe(
        numero => {
          console.log('sub ', numero),
            error => console.log("error en el obs ", error),
            () => console.log("el observador termino")
        });
  }
  ngOnDestroy() {
    console.log("la pagina se cerro")
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador += 1;
        //funcion de notificación de informacion nueva. 
        observer.next(contador);
        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        // if (contador === 2) {
        //   clearInterval(intervalo);
        //   observer.error("se presento un error al contador ");
        // }
      }, 1000)
    }).pipe(
      //map formatear datos para que tengan salida como yo quiero
      map(resp => resp + 10),
      filter((resp, index) => {
        // console.log("filter", resp, index);
        if (resp % 2 === 1) {
          return resp
        } else {
          return false;
        }
      })
    )
  }



}
