import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [MatTableModule,MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  registrosUsers!: any[];
  registroClients!: any[];
  usersFiltrados!: any[];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'numero','edit'];
  constructor(private router: Router,public usuarioService: UsuarioService){}
  ngOnInit(): void {
    this.registroClients = [];
    this.registrosUsers = [];
    this.usersFiltrados = [];
    this.usuarioService.getAllUsuarios().subscribe(
      response => {
        for(let i = 0; i < response.length; i++){
          console.log(response[i]);
          if(response[i].usuario_rol == "vendedor" || response[i].usuario_rol == "admin"){
            console.log("entro: ", response[i].usuario_rol);
            this.registrosUsers.push(response[i]);
          }else{
            console.log("entro 1: ", response[i].usuario_rol);
            if(response[i].usuario_rol == "comprador"){
              console.log("entro 2: ", response[i].usuario_rol);
              this.registroClients.push(response[i]);
            }
          }
        }     
        // Manejar la respuesta de éxito aquí
        console.log('Registros de users mostradas', response);
      },
      error => {
        // Manejar el error aquí
        console.error('Error al mostrar el users', error);
      }
    )
    setTimeout(() => {
      this.usuarioService.getAllUsuarios().subscribe(
        response => {
          for(let i = 0; i < response.length; i++){
            console.log(response[i]);
            if(response[i].usuario_rol == "vendedor" || response[i].usuario_rol == "admin"){
              console.log("entro: ", response[i].usuario_rol);
              this.registrosUsers.push(response[i]);
            }else{
              console.log("entro 1: ", response[i].usuario_rol);
              if(response[i].usuario_rol == "comprador"){
                console.log("entro 2: ", response[i].usuario_rol);
                this.registroClients.push(response[i]);
              }
            }
          }     
          // Manejar la respuesta de éxito aquí
          console.log('Registros de users mostradas', response);
        },
        error => {
          // Manejar el error aquí
          console.error('Error al mostrar el users', error);
        }
      )
    }, 1000);
    
  }

  enterprofile(id: number){
    console.log("id es:"+id);
    this.router.navigate(['/admin/detalleuser'], { queryParams: { userid: id } });
  }

}
