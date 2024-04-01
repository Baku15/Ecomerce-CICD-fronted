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
  password = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  rol = new FormControl('', [Validators.required]);
  newUser: any = {};

  errorMessage = '';

  constructor(private usuarioService: UsuarioService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  registrarUser(){
    this.newUser = {
      usuario_nombre: this.nombre.value,
      usuario_pass: this.password.value,
      usuario_estado: "activo",
      usuario_correo: this.email.value,
      usuario_telefono: this.telefono.value,
      usuario_rol: this.rol.value
    }
    this.usuarioService.registerNewUsuario(this.newUser).subscribe({
      next: (response) => {
        console.log(response+" Usuario registrado: "+this.newUser);
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error+" Usuario registrado: "+this.newUser); // Para propósitos de depuración
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
}
