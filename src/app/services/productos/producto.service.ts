import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../../model/producto.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:8040/api/producto';

  private base_search = '';
  list() {
    return this.http.get<Producto[]>(
      'http://localhost:8040/api/producto'
    );
  }

  getAllProducts(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getProductoById(productoId: string | number): Observable<any> {
    return this.http.get<[]>(
      `http://localhost:8040/api/producto/${productoId}`
    );
  }

  getAllProductsByNombre(nombre: any): Observable<any> {
    return this.http.get(`http://localhost:8092/api/search/${nombre}`);
  }

  deleteProducto(productoId: any): Observable<any> {
    return this.http.delete(
      `http://localhost:8092/api/producto/${productoId}`
    );
  }

  get(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }
  create(productoDto: any) {
    return this.http.post<Producto>(
      'http://localhost:8092/api/producto/crear',
      productoDto
    );
  }
  updateProducto(productoId: any, productoDto: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http
      .put<any>(
        `http://localhost:8092/api/producto/${productoId}`,
        productoDto,
        { headers: headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating product:', error);
          return throwError(error);
        })
      );
  }
}
