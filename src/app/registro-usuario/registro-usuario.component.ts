import {Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {merge} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,MatSelectModule,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css'
})
export class RegistroUsuarioComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  nombre = new FormControl('', [Validators.required]);
  carnet = new FormControl('', [Validators.required]);
  apellido = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  newUser: any = {};
  stringMessage: string = '';

  errorMessage = '';

  constructor(private usuarioService: UsuarioService,private router: Router,) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  registrarUser(){
    if (this.nombre.value === '' || this.password.value === '' || this.telefono.value === '') {
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
      roles: ["Comprador"]
    }
    this.usuarioService.registerNewUser(this.newUser).subscribe({
      next: (response) => {
        console.log(response+" Usuario registrado: "+this.newUser);
        this.mostrarMensajeDeleteExito();
          setTimeout(() => {
            this.router.navigate(['../login']);
          }, 3000); 
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error+" Usuario no registrado: "+this.newUser); // Para propósitos de depuración
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
  irhome(){
    this.router.navigate(['../login']);
  
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
