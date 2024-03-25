import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../../model/producto.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/productos';

  list(){
      return this.http.get<Producto[]>('http://localhost:8080/productos');
  }

get(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
}
  create(producto: any){
    return this.http.post<Producto>('http://localhost:8080/productos',producto);

  }
update(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto);
}
  constructor() { }
 }
