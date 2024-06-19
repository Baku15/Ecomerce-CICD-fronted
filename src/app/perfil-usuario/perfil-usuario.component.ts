import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, catchError, map, of } from 'rxjs';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

import {Inject} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ModalpasswordComponent } from '../modalpassword/modalpassword.component';
import { AuthService } from '../services/autenticacion/auth.service';

export interface DialogData {
  id: number;
  name: string;
  password: string;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [AsyncPipe,CommonModule,MatSelectModule,FormsModule, ReactiveFormsModule,MatButtonModule, MatDividerModule, MatIconModule,MatFormFieldModule, MatInputModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit{
  auxid: number = 0;
  auxnombre!: any;
  auxpassword!: any;
  auxtelefono!: any
  auxrol!: any;
  auxemail!: any;
  auxestado!: any;
  flagg: number = 0;
  username: string = '';
  userId: number = 0;
  role: string = '';
  token: string = '';
  private authSubscription: Subscription = new Subscription();
  animal!: string;
  name!: string;
  hide = true;
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

  emailf = new FormControl('', [Validators.required, Validators.email]);
  nombref = new FormControl('', [Validators.required]);
  passwordf = new FormControl('', [Validators.required]);
  telefonof = new FormControl('', [Validators.required]);
  rolf = new FormControl('', [Validators.required]);

  direccion = new FormControl('', [Validators.required]);
  ciudad = new FormControl('', [Validators.required]);
  codigopostal = new FormControl('', [Validators.required]);

  newUser: any = {};
  newDireccion: any = {};
  stringMessage: string = '';
  options: any[] = [];

  errorMessage = '';

  userList$!: Observable<any[]>;
  personaslist$!: Observable<any[]>;
  addressList$!: Observable<any[]>;
  constructor(private authService: AuthService,public dialog: MatDialog,private router: Router, private usuarioService: UsuarioService,private route: ActivatedRoute) {
    merge(this.emailf.statusChanges, this.emailf.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  ngOnInit(): void {
    this.auxid = this.userId;
    this.auxnombre = "";
    this.auxpassword = "";
    this.auxtelefono = "";
    this.auxrol = "";
    this.auxemail = "";
    this.auxestado = "";

    this.authSubscription.add(this.authService.username$.subscribe(username => this.username = username));
    this.authSubscription.add(this.authService.userId$.subscribe(userId => this.userId = userId));
    this.authSubscription.add(this.authService.role$.subscribe(role => this.role = role));
    this.authSubscription.add(this.authService.token$.subscribe(token => this.token = token));
    this.nombre = '';
    this.userPropid = localStorage.getItem('token') ? parseInt(localStorage.getItem('token')!) : 0;
    this.obteneraddress();
    this.userporid();
    setTimeout(() => {
      this.obtenerdatos();
      this.personas();
    },500)    
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  obteneraddress(){
    this.usuarioService.getAllAddress().subscribe({
      next: (response) => {
        this.addressList$ = of(response.result);
        this.options = response.result;
        console.log(response.result+"siu");
      },
      error: (error) => {
        // Manejar el error aquí
        console.error('Error al mostrar el adress', error);
      }
    });
  }

  actualizardatos(){
    this.userporid();
    
    this.obteneraddress();
    setTimeout(() => {
      this.personas();
      this.obtenerdatos();
      this.obteneraddress();
    },500) 
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalpasswordComponent, {
      data: {id:this.iduser, name: this.nombre, password: this.password},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  deleteUser(){
    console.log("entrando a delete: ", this.iduser)
    this.usuarioService.deleteUsuariobyId(this.iduser).subscribe({
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
          this.logout();
        }, 3000); 
      }
    });
  }

  logout() {
    // Limpia el almacenamiento local o la sesión donde guardas el token de autenticación
    localStorage.removeItem('token');
    // Navega de vuelta a la pantalla de login
    this.router.navigate(['/']);
  }

  updateErrorMessage() {
    if (this.emailf.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.emailf.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }
  registrarUser(){
    if(this.nombref.value && this.nombref.value.length > 50 || this.passwordf.value && this.passwordf.value.length > 50 || this.telefonof.value && this.telefonof.value.length > 50 || this.emailf.value && this.emailf.value.length > 50){
      this.errorMessage = 'Maximo 50 caracteres en los inputs.';
      this.mostrarMensajeRegistroError();
      console.error('Espacio maximo alcanzado.');
      return;
    }
    this.auxid = this.userId;
    this.auxnombre = this.nombref.value;
    this.auxpassword = this.passwordf.value;
    this.auxtelefono = this.telefonof.value;
    this.auxrol = this.rolf.value;
    this.auxemail = this.emailf.value;
    this.auxestado = "activo";
    if(this.nombref.value == ""){
      this.auxnombre = this.nombre;
    }
    if(this.passwordf.value == ""){
      this.auxpassword = this.password;
    }
    if(this.telefonof.value == ""){
      this.auxtelefono = this.celular;
    }
    if(this.rolf.value == ""){
      this.auxrol = this.role;
    }
    if(this.emailf.value == ""){
      this.auxemail = this.email;
    }


    this.newUser = {
      idUsuario: this.userId,
      nombre: this.auxnombre,
      apellido: "",      
      carnet: this.paterno,
      telefono: this.auxtelefono,
      email: this.auxemail,
      password: this.auxpassword,
      username: this.usuario,
      roles: ["EMPLEADO"]
    }
    this.usuarioService.editpersona(this.userId, this.newUser).subscribe({
      next: (response) => {
        console.log(response+" Usuario registrado: "+this.newUser);
        this.mostrarMensajeDeleteError();
        this.actualizardatos();
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error+" Usuario registrado: "+this.newUser.usuario_nombre); // Para propósitos de depuración
      }
    });
  }

  registrarAddress(){
    if (this.direccion.value === '' || this.codigopostal.value === '' || this.ciudad.value === '') {
      this.stringMessage = 'Debe llenar todos los campos';
      console.error('Debe llenar todos los campos');
      this.mostrarMensajeDeleteError();
      return;
    }
    this.newDireccion = {
      address: this.direccion.value,
      city: this.ciudad.value,
      postalCode: this.codigopostal.value,
      peopleId: 1
    }
    this.usuarioService.registerNewAddres(this.newDireccion).subscribe({
      next: (response) => {
        console.log("la lograste nabo");
        this.mostrarMensajeDeleteExito();
        this.actualizardatos();
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        this.actualizardatos();
        console.error(error+ "fuiste"); // Para propósitos de depuración
      }
    });
  }

  personas(){
    this.usuarioService.getpersonas().subscribe({
      next: (response) => {
        for (let i = 0; i < response.result.length; i++) {
          if(response.result[i].idPersona == this.edad){
            this.nombre = response.result[i].nombre;
            this.paterno = response.result[i].carnet;
            this.celular = response.result[i].telefono;
          }
        }
          
      },
      error: (error) => {
        console.error("SOY EL ERROR:"+error); // Para propósitos de depuración
      }
    });
  }

  userporid(){
    this.usuarioService.userporid(this.userId).subscribe({
      next: (response) => {
        this.iduser = response.result.idUsuario;
          this.materno = "";
          this.edad = response.result.idPersona;
          this.genero = "";
          this.domicilio = "";
          this.email = response.result.email;
          this.usuario = response.result.username;
          this.password = response.result.password;
          this.createdate = "";
          this.updatedate = "";
      },
      error: (error) => {
        console.error("SOY EL ERROR:"+error); // Para propósitos de depuración
      }
    });
    setTimeout(() => {
      this.obtenerdatos();
    },500) 
  
  }

  obtenerdatos() {
    this.userporid();
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
