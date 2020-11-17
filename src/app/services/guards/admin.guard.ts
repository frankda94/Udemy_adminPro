import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log("guard ADMIN ");

    if (this.usuarioService.role === 'ADMIN_ROLE') {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }

}
