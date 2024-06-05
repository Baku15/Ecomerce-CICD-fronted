import { Component, OnInit, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/autenticacion/auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecaptchaModule } from "ng-recaptcha";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RecaptchaModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  recaptchaService = inject(ReCaptchaV3Service);
  executeRecaptcha() {
    this.recaptchaService.execute('').subscribe((token) => {
      console.log("el token: "+token);
    });
  }
  username: string = '';
  password: string = '';
  hide = true;
  errorMessage: string = '';
  stringMessage: string = '';

  credentials: any = {};

  constructor(private router: Router, private usuarioService: UsuarioService, private authService: AuthService) {}

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
        const { accessToken, userId, username, role } = response.result;
        this.authService.setSessionData(accessToken, username, userId, role);
        this.router.navigate(['/admin/welcome-page'], { queryParams: { number: accessToken } });
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
