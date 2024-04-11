import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  username: string = ''; // Cambiamos para usar campos separados
  password: string = '';
  hide = true;
  errorMessage: string = '';
  users$!: Observable<any[]>;
  stringMessage: string = '';

  constructor(private router: Router, private usuarioService: UsuarioService) {}
  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        this.users$ = of(response); // Ajustamos según la respuesta real esperada
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
        console.log('Registros de users mostrados', response);
      },
      error: (error) => {
        console.error(error); // Para propósitos de depuración
      }
    });
  }

  onLogin(): void {
    if (this.username === '' || this.password === ''){
      this.stringMessage = 'Debe llenar todos los campos';
      console.error('Debe llenar todos los campos');
      this.mostrarMensajeDeleteError();
      return;
    }
    this.users$.subscribe(user => {
      for(let i = 0; i < user.length; i++){
        if(this.username == user[i].usuario_nombre && this.password == user[i].usuario_pass){
          localStorage.setItem('token', user[i].id_usuario);
          console.log('Usuario correcto: ', user[i].usuario_nombre, user[i].id_usuario);
          this.router.navigate(['/admin'], { queryParams: { number: user[i].id_usuario } });
        }else{
          this.errorMessage = 'Usuario o contraseña incorrecta: ';
          console.log(this.errorMessage);
          this.stringMessage = 'Error en el usuario o contraseña';
          this.mostrarMensajeDeleteError();
        }
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
