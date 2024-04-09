import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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


@Component({
  selector: 'app-detalleuser',
  standalone: true,
  imports: [MatSelectModule,FormsModule, ReactiveFormsModule,MatButtonModule, MatDividerModule, MatIconModule,MatFormFieldModule, MatInputModule],
  templateUrl: './detalleuser.component.html',
  styleUrl: './detalleuser.component.css'
})
export class DetalleuserComponent implements OnInit{
  hide = true;
  userPropid: number = 1;
  nombre: string = "";
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

  emailf = new FormControl('', [Validators.required, Validators.email]);
  nombref = new FormControl('', [Validators.required]);
  passwordf = new FormControl('', [Validators.required]);
  telefonof = new FormControl('', [Validators.required]);
  rolf = new FormControl('', [Validators.required]);
  newUser: any = {};
  stringMessage: string = '';

  errorMessage = '';

  userList$!: Observable<any[]>;
  constructor(private router: Router, private usuarioService: UsuarioService,private route: ActivatedRoute) {
    merge(this.emailf.statusChanges, this.emailf.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userPropid = params['userid'];
      console.log("ida es:"+this.userPropid);
    });
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        console.log(response);
        this.userList$ = of(response); // Ajustamos según la respuesta real esperada
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error); // Para propósitos de depuración
      }
    });
    setTimeout(() => {
      this.obtenerdatos();
    },500)    
  }

  actualizardatos(){
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
    setTimeout(() => {
      this.obtenerdatos();
    },500) 
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
    if (this.nombref.value === '' || this.passwordf.value === '' || this.telefonof.value === '' || this.rolf.value === '') {
      this.stringMessage = 'Debe llenar todos los campos';
      console.error('Debe llenar todos los campos');
      this.mostrarMensajeDeleteError();
      return;
    }
    this.newUser = {
      id_usuario: this.userPropid,
      usuario_nombre: this.nombref.value,
      usuario_pass: this.passwordf.value,
      usuario_estado: "activo",
      usuario_correo: this.emailf.value,
      usuario_telefono: this.telefonof.value,
      usuario_rol: this.rolf.value
    }
    this.usuarioService.registerNewUsuario(this.newUser).subscribe({
      next: (response) => {
        console.log(response+" Usuario registrado: "+this.newUser);
        this.mostrarMensajeDeleteError();
        this.actualizardatos();
        // Ajustamos según la respuesta real esperada
        // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
      },
      error: (error) => {
        console.error(error+" Usuario registrado: "+this.newUser); // Para propósitos de depuración
      }
    });
  }
  obtenerdatos() {
    this.userList$.subscribe((userList: any[]) => {
      for (var i = 0; i < userList.length; i++) {
        if (this.userPropid == userList[i].id_usuario) {
          console.log("id encontrado: "+userList[i].usuario_nombre);
          this.nombre = userList[i].usuario_nombre;
          this.paterno = userList[i].usuario_rol;
          this.materno = "";
          this.edad = 0;
          this.genero = "";
          this.celular = userList[i].usuario_telefono;
          this.domicilio = "";
          this.email = userList[i].usuario_correo;
          this.usuario = "";
          this.password = "";
          this.status = userList[i].usuario_estado;
          this.createdate = "";
          this.updatedate = "";
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
