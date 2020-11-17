import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;
  auth2: any;

  constructor(public router: Router, private usuarioService: UsuarioService,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.email = localStorage.getItem('recordarme-email') || '';
    this.renderButton();
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();

  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  }


  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        // let profile = googleUser.getBasicProfile();
        let token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(token).subscribe(resp => {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          })
        });
      }, (error) => {
        console.log(error);

      }
    )
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    let usuario = new Usuario(null, forma.value.email, forma.value.password);
    this.usuarioService.login(forma.value, forma.value.recuerdame).subscribe(correcto => {
      this.router.navigateByUrl('/');
    })


  }
}
