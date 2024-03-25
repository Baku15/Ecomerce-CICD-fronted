import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,MatFormFieldModule, MatInputModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit{
  userPropid: number = 2;
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

  userList$!: Observable<any[]>;
  ngOnInit(): void {
    this.userList$ = of([
      {id:1, rolId: 1, nombre: "Alberto", paterno: "perez", materno: "montes", edad: 20, genero: "masculino", celular: "75841245", domicilio: "calle 1", email: "asd@gmail.com", usuario: "alberto", password: "1234", status: "activo", createdate: "2021-07-01", updatedate: "2021-07-01"},
      {id:2, rolId: 2, nombre: "Juan", paterno: "perez", materno: "montes", edad: 20, genero: "masculino", celular: "75841245", domicilio: "calle 1", email: "asd@gmail.com", usuario: "juan", password: "1234", status: "activo", createdate: "2021-07-01", updatedate: "2021-07-01"},
      {id:3, rolId: 3, nombre: "Pedro", paterno: "perez", materno: "montes", edad: 20, genero: "masculino", celular: "75841245", domicilio: "calle 1", email: "asd@gmail.com", usuario: "pedro", password: "1234", status: "activo", createdate: "2021-07-01", updatedate: "2021-07-01"},
    ]);
    this.obtenerdatos();
  }

  obtenerdatos() {
    this.userList$.subscribe((userList: any[]) => {
      for (var i = 0; i < userList.length; i++) {
        if (this.userPropid == userList[i].id) {
          this.nombre = userList[i].nombre;
          this.paterno = userList[i].paterno;
          this.materno = userList[i].materno;
          this.edad = userList[i].edad;
          this.genero = userList[i].genero;
          this.celular = userList[i].celular;
          this.domicilio = userList[i].domicilio;
          this.email = userList[i].email;
          this.usuario = userList[i].usuario;
          this.password = userList[i].password;
          this.status = userList[i].status;
          this.createdate = userList[i].createdate;
          this.updatedate = userList[i].updatedate;
        }
      }
    }); 
  }
}
