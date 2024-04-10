import {Component, Inject} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DialogData } from '../perfil-usuario/perfil-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modalpassword',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule],
  templateUrl: './modalpassword.component.html',
  styleUrl: './modalpassword.component.css'
})
export class ModalpasswordComponent {
  stringMessage: string = 'Error al eliminar';
  name = new FormControl('');
  constructor(
    public dialogRef: MatDialogRef<ModalpasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router, private usuarioService: UsuarioService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteUser(){
    if(this.data.password == this.name.value){
      console.log("entrando a delete: ", this.data.id)
      this.usuarioService.deleteUsuariobyId(this.data.id).subscribe({
      next: (response) => {
        console.log(response);
        this.mostrarMensajeDeleteExito();
        setTimeout(() => {
          this.logout();
        }, 3000); 
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error); // Para propósitos de depuración
        this.mostrarMensajeDeleteExito();
        setTimeout(() => {
          this.dialogRef.close();
          this.logout();
        }, 3000); 
      }
    });
    }else{
      this.mostrarMensajeDeleteError();
    }    
  }

  logout() {
    // Limpia el almacenamiento local o la sesión donde guardas el token de autenticación
    localStorage.removeItem('token');
    // Navega de vuelta a la pantalla de login
    this.router.navigate(['/']);
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

