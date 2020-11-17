import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { UsuarioService } from '../usuarios/usuario.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(public usuarioService: UsuarioService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    console.log("se activa can load");
    
    return this.usuarioService.validarToken()
    .pipe(
      tap( isAuth => {
        if (!isAuth){
          this.router.navigateByUrl('/login');
        }
      }
      ));
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return this.usuarioService.validarToken()
    .pipe(
      tap( isAuth => {
        if (!isAuth){
          this.router.navigateByUrl('/login');
        }
      }
      ));
  }

}
