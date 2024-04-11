import {Component, OnInit} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable, merge, of} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-recoverpassword',
  standalone: true,
  imports: [MatRadioModule,MatButtonModule, MatDividerModule, MatIconModule,MatSelectModule,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recoverpassword.component.html',
  styleUrl: './recoverpassword.component.css'
})
export class RecoverpasswordComponent implements OnInit{
  userPropid: number = 0;
  nombre!: string;
  paterno: string = "";
  materno: string = "";
  edad: number = 0;
  genero: string = "";
  celular: string = "";
  domicilio: string = "";
  email: string = "";
  usuario: string = "";
  password: string = "";
  status: string = "";
  createdate: string = "";
  updatedate: string = "";
  iduser: number = 0;
  favoriteSeason!: string;
  seasons: string[] = ['User', 'Password'];
  userlist$!: Observable<any[]>;
  hide = true;
  emailForm = new FormControl('', [Validators.email]);
  nombreForm = new FormControl('', []);
  passwordForm = new FormControl('', []);
  telefono = new FormControl('', []);
  rol = new FormControl('', []);
  newUser: any = {};
  stringMessage: string = '';
  userList$!: Observable<any[]>;

  errorMessage = '';

  constructor(private usuarioService: UsuarioService,private router: Router,) {
    merge(this.emailForm.statusChanges, this.emailForm.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        this.userList$ = of(response); // Ajustamos según la respuesta real esperada
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error); // Para propósitos de depuración
      }
    });
  }
  registrarUser(){
    this.obtenerdatos();
    if(this.favoriteSeason == 'User'){
      if (this.nombreForm.value === '') {
        this.stringMessage = 'Debe llenar todos los campos';
        console.error('Debe llenar todos los campos');
        this.mostrarMensajeDeleteError();
        return;
      }
      setTimeout(() => {
        this.newUser = {
          id_usuario: this.iduser,
          usuario_nombre: this.nombreForm.value,
          usuario_pass: this.password,
          usuario_estado: "activo",
          usuario_correo: this.email,
          usuario_telefono: this.celular,
          usuario_rol: this.paterno
        }
        this.usuarioService.registerNewUsuario(this.newUser).subscribe({
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
            console.error(error+" Usuario registrado: "+this.newUser); // Para propósitos de depuración
            this.mostrarMensajeDeleteError();
          }
        });
      }, 500);   
    }
    if(this.favoriteSeason == 'Password'){
      if (this.passwordForm.value === '') {
        this.stringMessage = 'Debe llenar todos los campos';
        console.error('Debe llenar todos los campos');
        this.mostrarMensajeDeleteError();
        return;
      }
      setTimeout(() => {
        this.newUser = {
          id_usuario: this.iduser,
          usuario_nombre: this.nombre,
          usuario_pass: this.passwordForm.value,
          usuario_estado: "activo",
          usuario_correo: this.email,
          usuario_telefono: this.celular,
          usuario_rol: this.paterno
        }
        this.usuarioService.registerNewUsuario(this.newUser).subscribe({
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
            console.error(error+" Usuario registrado: "+this.newUser); // Para propósitos de depuración
            this.mostrarMensajeDeleteError();
          }
        });
      }, 500);   
    }
     
  }
  obtenerdatos() {
    this.userList$.subscribe((userList: any[]) => {
      for (var i = 0; i < userList.length; i++) {
        if (this.emailForm.value == userList[i].usuario_correo) {
          this.iduser = userList[i].id_usuario
          this.nombre = userList[i].usuario_nombre;
          this.paterno = userList[i].usuario_rol;
          this.materno = "";
          this.edad = 0;
          this.genero = "";
          this.celular = userList[i].usuario_telefono;
          this.domicilio = "";
          this.email = userList[i].usuario_correo;
          this.usuario = "";
          this.password = userList[i].usuario_pass;
          this.status = userList[i].usuario_estado;
          this.createdate = "";
          this.updatedate = "";
        }
      }
    }); 
  }
  obtenerusers(){
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        this.userlist$ = of(response);
        console.log('Registros de users mostradas', this.userlist$);
      },
      error: (error) => {
        // Manejar el error aquí
        console.error('Error al mostrar el users', error);
      }
    });  
  }
  updateErrorMessage() {
    if (this.emailForm.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.emailForm.hasError('email')) {
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
