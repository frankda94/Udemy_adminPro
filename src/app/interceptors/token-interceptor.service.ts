import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (token) {
      const reqClone = req.clone({
        headers: req.headers.set('x-token', token)
      });
      return next.handle(reqClone)
        .pipe(
           catchError ((error: HttpErrorResponse) => {
             if (error.status === 401) {
               Swal.fire('Sesión vencida', 'usuario no autorizado', 'error');
                this.router.navigateByUrl('/login');
             }
            return throwError("usuario no autorizado");
           })
        )
    } else {
      return next.handle(req.clone());
    }
  }

  manejarError(error: HttpErrorResponse) {
    if ( 401 === error.status){
      this.router.navigateByUrl('/login');
    }
    return throwError('error personalizado')
  }
}
