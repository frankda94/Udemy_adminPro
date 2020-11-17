import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})


export class RegisterComponent implements OnInit {

  public formSubmitetd = false;
  public registerForm = this.fb.group({
    nombre: ['francisco', Validators.required],
    email: ['frank23@test.com', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [false, Validators.required],
  },
    { validators: this.passwordsIguales('password', 'password2') }
  );


  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  contrasenasIguales() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    return pass1 !== pass2 && this.formSubmitetd ? true : false;
  }

  registrarUsuario() {
    this.formSubmitetd = true;
    if (this.registerForm.valid) {
      this.usuarioService.crearUsuario(this.registerForm.value)
        .subscribe(resp => {
          this.router.navigateByUrl('/');
        });
    }
  }


  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitetd) {
      return true;
    }
    return false;
  }

  aceptaTerminos() {
    return !this.registerForm.value.terminos && this.formSubmitetd;
  }

  passwordsIguales(pass1, pass2) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);
      if (pass1Control.value == pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    }
  }
}
