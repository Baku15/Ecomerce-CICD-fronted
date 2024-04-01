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

  constructor(private router: Router, private usuarioService: UsuarioService,) {}
  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        this.users$ = of(response); // Ajustamos según la respuesta real esperada
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error); // Para propósitos de depuración
      }
    });
  }

  onLogin(): void {
    this.users$.subscribe(user => {
      for(let i = 0; i < user.length; i++){
        if(this.username == user[i].usuario_nombre && this.password == user[i].usuario_pass){
          this.router.navigate(['/admin/menu-principal']);
        }else{
          this.errorMessage = 'Usuario o contraseña incorrecta';
          console.log(this.errorMessage);
        }
      }
    });
  }
}
