import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css'],
})


export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(private usuarioService: UsuarioService, private router: Router) {

    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
      condiciones: new FormControl(false),
    }, { validators: this.sonIguales('password', 'confirmPassword') });

    this.forma.setValue({
      nombre: 'francisco',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
      condiciones: true
    });
  }

  ngOnInit() {
    init_plugins();
  }

  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null
      }
      return {
        sonIguales: true
      }
    }
  }

  registrarUsuario() {

    if (this.forma.invalid) {
      return;
    }
    if (!this.forma.value.condiciones) {
      swal('Importante', 'debe aceptar las condiciones', 'warning');
      return;
    }
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password
    );
    this.usuarioService.crearUsuario(usuario).subscribe(resp => this.router.navigate(["/login"]));
  }
}
