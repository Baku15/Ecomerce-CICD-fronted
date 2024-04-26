import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegistroCarritoService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8095/api/registro-carrito-compras';
  private base_search = ''
  crearRegistroCarritoCompras(registroCarritoDto: any){
    return this.http.post('http://localhost:8095/api/registro-carrito-compras/crear',registroCarritoDto);
  }
  obtenerTodosLosRegistros():Observable<any>{
    return this.http.get('http://localhost:8095/api/registro-carrito-compras/all');
  }
  eliminarRegistroPorId(registroId: any):Observable<any>{
    return this.http.delete(`http://localhost:8095/api/registro-carrito-compras/eliminar/${registroId}`);
  }
}
