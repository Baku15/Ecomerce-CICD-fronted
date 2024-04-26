import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/Usuarios/usuario.service';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [MatSlideToggleModule,FormsModule, ReactiveFormsModule,MatTableModule,MatButtonModule, MatDividerModule, MatIconModule,AsyncPipe,MatFormFieldModule, MatSelectModule],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  checked = false;
  rol = new FormControl('', [Validators.required]);
  selected = 'option2';
  userlist$!: Observable<any[]>;
  registrosUsers!: any[];
  registroClients!: any[];
  usersFiltrados!: any[];
  slideemploy!: any[];
  slidecost!: any[];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'numero','edit','rol'];
  constructor(private router: Router,public usuarioService: UsuarioService){}
  ngOnInit(): void {
    this.slidecost = [];
    this.slideemploy = [];
    this.userlist$ = of([]);
    this.registroClients = [];
    this.registrosUsers = [];
    this.usersFiltrados = [];
    this.usuarioService.getAllCostumers().subscribe({
      next: (response) => {
        this.userlist$ = of(response.result.filter((user: any) => user.rol === 'Comprador'));
        if(response.result.length > 0){
          for(let i = 0; i < response.result.length; i++){
            this.slideemploy.push(false);
            //console.log(this.slidecost[i]);
          }
        }
        
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
        if(response.result.length > 0){
          for(let i = 0; i < response.result.length; i++){
            this.slidecost.push(false);
            //console.log(this.slidecost[i]);
          }
        }
        
        console.log(response.result,'Registros de empleados mostradas');
      },
      error: (error) => {
        // Manejar el error aquí
        console.error('Error al mostrar el users', error);
      }
    }); 
          
  }

  cargardatos(){
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
  
  actualizarrol(id: number){
    const newrol = this.rol.value
    if (newrol !== null) {
      this.usuarioService.changerole(id, newrol).subscribe({
        next: (response) => {
          this.mostrarMensajeDeleteExito();
          setTimeout(() => {
            this.cargardatos();
            for(let i = 0; i < this.slidecost.length; i++){
              this.slidecost[i] = false;
            }
            for(let i = 0; i < this.slideemploy.length; i++){
              this.slideemploy[i] = false;
            }
          }, 500);
          
          // Ajustamos según la respuesta real esperada
          // Suponiendo que la respuesta contiene directamente los datos del usuario necesarios
        },
        error: (error) => {
          console.error(error+" Usuario no registrado: "); // Para propósitos de depuración
          this.mostrarMensajeDeleteError();
        }
      });
    }
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
