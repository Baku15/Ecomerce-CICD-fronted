import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../../model/producto.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/ecomerce/productos';

  private base_search = ''
  list(){
      return this.http.get<Producto[]>('http://localhost:8080/ecomerce/productos');
  }

  getAllProducts():Observable<any>{
    return this.http.get(this.baseUrl);
  }

  getProductoById(productId: string | number):Observable<any>{
    return this.http.get(`http://localhost:8080/ecomerce/producto/${productId}`);
  }
 getAllProductsByNombre(nombre: any) :Observable<any>{
    return this.http.get(`http://localhost:8080/ecomerce/search/${nombre}`);
  }

deleteProducto(productoId: any) :Observable<any>{
    return this.http.delete(`http://localhost:8080/ecomerce/producto/${productoId}`);
  }


get(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
}
  create(productoDto: any){
    return this.http.post<Producto>('http://localhost:8080/ecomerce/producto',productoDto);

  }
update(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto);
}
  constructor() { }
 }
