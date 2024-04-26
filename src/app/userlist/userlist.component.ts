import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [MatTableModule,MatButtonModule, MatDividerModule, MatIconModule,AsyncPipe],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  userlist$!: Observable<any[]>;
  registrosUsers!: any[];
  registroClients!: any[];
  usersFiltrados!: any[];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'numero','edit'];
  constructor(private router: Router,public usuarioService: UsuarioService){}
  ngOnInit(): void {
    this.userlist$ = of([]);
    this.registroClients = [];
    this.registrosUsers = [];
    this.usersFiltrados = [];
    this.usuarioService.getAllCostumers().subscribe({
      next: (response) => {
        this.userlist$ = of(response.result.filter((user: any) => user.rol === 'Comprador'));
        console.log(response.result[1].id,'Registros de clientes mostradas');
      },
      error: (error) => {
        // Manejar el error aquí
        console.error('Error al mostrar el users', error);
      }
    });
    
    this.usuarioService.getAllEmployees().subscribe({
      next: (response) => {
        this.registrosUsers = response.result.filter((user: any) => user.rol === 'EMPLEADO');
        console.log(response.result,'Registros de empleados mostradas');
      },
      error: (error) => {
        // Manejar el error aquí
        console.error('Error al mostrar el users', error);
      }
    }); 
          
  }

  enterprofile(id: number){
    console.log("id es:"+id);
    this.router.navigate(['/admin/detalleuser'], { queryParams: { userid: id } });
  }

}
