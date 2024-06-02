import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../../model/producto.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { Page } from '../../model/page.model';

@Injectable({
  providedIn: 'root',
})

export class ProductoService {
  private baseUrl = 'http://localhost:8040/api/producto';

  constructor(private http: HttpClient) {}

  list(page: number, size: number): Observable<Page<Producto>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<Page<Producto>>(`${this.baseUrl}/all-paginated`, { params });
  }

  getProductosByUsuario(userId: number, page: number, size: number): Observable<Page<Producto>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<Page<Producto>>(`${this.baseUrl}/usuario/${userId}`, { params });
  }

  getProductosByName(nombre: string, page: number, size: number): Observable<Page<Producto>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<Page<Producto>>(`${this.baseUrl}/search/${nombre}`, { params });
  }

  getAllProducts(): Observable<any> {
    return this.http.get(this.baseUrl + '/all');
  }

  getProductoById(productoId: string | number): Observable<any> {
    return this.http.get<[]>(
      `http://localhost:8040/api/producto/buscar/${productoId}`
    );
  }

  getAllProductsByNombre(nombre: any): Observable<any> {
    return this.http.get(`http://localhost:8040/api/producto/search/${nombre}`);
  }

  deleteProducto(productoId: any): Observable<any> {
    return this.http.delete(
      `http://localhost:8040/api/producto/eliminar/${productoId}`
    );
  }

  get(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  create(productoDto: any) {
    return this.http.post<Producto>(
      'http://localhost:8040/api/producto/crear',
      productoDto
    );
  }
  updateProducto(productoId: any, productoDto: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http
      .put<any>(
        `http://localhost:8040/api/producto/editar/${productoId}`,
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
