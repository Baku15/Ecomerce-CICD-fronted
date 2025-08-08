import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {untilDestroyed} from "@ngneat/until-destroy";

@Component({
  selector: 'app-registro-empleado',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.css']
})
export class RegistroEmpleadoComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  nombre = new FormControl('', [Validators.required]);
  carnet = new FormControl('', [Validators.required]);
  apellido = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  rol = new FormControl('', [Validators.required]);
  newUser: any = {};
  stringMessage: string = '';

  errorMessage = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateErrorMessage());
  }

  registrarUser() {
    if (
      this.nombre.value === '' ||
      this.password.value === '' ||
      this.telefono.value === '' ||
      this.rol.value === ''
    ) {
      this.stringMessage = 'Debe llenar todos los campos';
      console.error('Debe llenar todos los campos');
      this.mostrarMensajeDeleteError();
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
      roles: [this.rol.value]
    };
    this.usuarioService.registerNewUser(this.newUser).subscribe({
      next: (response) => {
        console.log(response + ' Usuario registrado: ' + this.newUser);
        this.mostrarMensajeDeleteExito();
        setTimeout(() => {
          this.router.navigate(['admin/userlist']);
        }, 3000);
      },
      error: (error) => {
        console.error(error + ' Usuario registrado: ' + this.newUser);
        this.mostrarMensajeDeleteError();
      }
    });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  irhome() {
    this.router.navigate(['admin/userlist']);
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
  ngOnDestroy(): void {}
}
