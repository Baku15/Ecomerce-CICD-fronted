import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8095/api/carrito-compras';
  private base_search = ''
  //get
  obtenerCarritoPorId(carritoId: string | number):Observable<any>{
    return this.http.get<[]>(`http://localhost:8095/api/carrito-compras/buscar/${carritoId}`);
  }
  //post un producto
  crearCarritoCompras(carritoDto: any){
    return this.http.post('http://localhost:8095/api/carrito-compras',carritoDto);
  }
  obtenerTodosLosCarritos():Observable<any>{
    return this.http.get('http://localhost:8095/api/carrito-compras/all');
  }
  eliminarCarritoPorId(carritoId: any):Observable<any>{
    return this.http.delete(`http://localhost:8095/api/carrito-compras/eliminar/${carritoId}`);
  }
}

//get id, if exist put, post
