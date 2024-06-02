import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  hide = true;
  errorMessage: string = '';
  users$!: Observable<any[]>;
  stringMessage: string = '';

  credentials: any = {};

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {}

  login() {
    if (this.username === '' || this.password === '') {
      this.stringMessage = 'Debe llenar todos los campos';
      console.error('Debe llenar todos los campos');
      this.mostrarMensajeDeleteError();
      return;
    }

    this.credentials = {
      username: this.username,
      password: this.password
    };

    this.usuarioService.login(this.credentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.result.accessToken);
        sessionStorage.setItem('userId', response.result.userId.toString());
        sessionStorage.setItem('username', response.result.username);
        sessionStorage.setItem('role', response.result.role); // Almacenar el rol del usuario
        this.router.navigate(['/admin/welcome-page'], { queryParams: { number: response.result.accessToken } });
      },
      error: (error) => {
        console.error('Error de login', error);
        this.mostrarMensajeDeleteError();
      }
    });
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
