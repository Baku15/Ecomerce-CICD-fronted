import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css'
})
export class RegistroUsuarioComponent {
  hide = true;
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|hotmail\\.com|miempresa\\.com)$')
  ]);
  nombre = new FormControl('', [Validators.required]);
  carnet = new FormControl('', [Validators.required]);
  apellido = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  newUser: any = {};
  stringMessage: string = '';

  errorMessage = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  registrarUser() {
    // Verificar si el formulario es válido
    if (!this.nombre.valid || !this.apellido.valid || !this.username.valid || !this.carnet.valid || !this.password.valid || !this.telefono.valid || !this.email.valid) {
      this.stringMessage = 'Debe llenar todos los campos correctamente';
      console.error('Debe llenar todos los campos correctamente');
      this.mostrarMensajeDeleteError();
      this.resetForm();
      return;
    }

    if (
      this.nombre.value && this.nombre.value.length < 5 ||
      this.password.value && this.password.value.length < 5 ||
      this.telefono.value && this.telefono.value.length < 5
    ) {
      this.stringMessage = 'Mínimo 5 caracteres en los inputs.';
      this.mostrarMensajeDeleteError();
      console.error('Espacio mínimo no alcanzado.');
      this.resetForm();
      return;
    }

    if (
      this.nombre.value && this.nombre.value.length > 50 ||
      this.password.value && this.password.value.length > 50 ||
      this.telefono.value && this.telefono.value.length > 50
    ) {
      this.stringMessage = 'Máximo 50 caracteres en los inputs.';
      this.mostrarMensajeDeleteError();
      console.error('Espacio máximo alcanzado.');
      this.resetForm();
      return;
    }

    this.newUser = {
      nombre: this.nombre.value,
      apellido: this.apellido.value,
      carnet: this.carnet.value,
      telefono: this.telefono.value,
      email: this.email.value,
      password: this.password.value,
      username: this.username.value,
      roles: ["Comprador"]
    };

    this.usuarioService.registerNewUser(this.newUser).subscribe({
      next: (response) => {
        console.log(response + " Usuario registrado: " + this.newUser);
        this.mostrarMensajeDeleteExito();
        setTimeout(() => {
          this.router.navigate(['../login']);
        }, 3000);
      },
      error: (error) => {
        console.error(error + " Usuario no registrado: " + this.newUser);
        this.mostrarMensajeDeleteError();
        this.resetForm();
      }
    });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else if (this.email.hasError('pattern')) {
      this.errorMessage = 'Email must be one of the following domains: @gmail.com, @hotmail.com, @miempresa.com';
    } else {
      this.errorMessage = '';
    }
  }

  irhome() {
    this.router.navigate(['../login']);
  }

  resetForm() {
    this.nombre.reset();
    this.apellido.reset();
    this.username.reset();
    this.carnet.reset();
    this.password.reset();
    this.telefono.reset();
    this.email.reset();
  }

  mostrarAlerta = false;
  mostrarAlertaError = false;
  mostrarAlertaDelete = false;
  mostrarAlertaErrorDelete = false;

  mostrarMensajeRegistroExito() {
    this.mostrarAlerta = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }

  mostrarMensajeRegistroError() {
    this.mostrarAlertaError = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }

  mostrarMensajeDeleteExito() {
    this.mostrarAlertaDelete = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }

  mostrarMensajeDeleteError() {
    this.mostrarAlertaErrorDelete = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }

  cerrarAlerta() {
    this.mostrarAlerta = false;
    this.mostrarAlertaError = false;
    this.mostrarAlertaDelete = false;
    this.mostrarAlertaErrorDelete = false;
  }
}
