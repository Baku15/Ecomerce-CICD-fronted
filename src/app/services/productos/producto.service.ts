import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../../model/producto.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { Page } from '../../model/page.model';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root',
})

export class ProductoService {
  private baseUrl = 'http://localhost:8040/api/producto';

  constructor(private http: HttpClient, private authService: AuthService) {}

  list(page: number, size: number, sort: string, order: string): Observable<Page<Producto>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('sort', `${sort},${order}`);

    return this.http.get<Page<Producto>>(`${this.baseUrl}/all-paginated`, { params });
  }

  getProductosByUsuario(userId: number, page: number, size: number, sort: string, order: string): Observable<Page<Producto>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('sort', `${sort},${order}`);

    return this.http.get<Page<Producto>>(`${this.baseUrl}/usuario/${userId}`, { params });
  }

  getProductosByName(nombre: string, page: number, size: number, sort: string, order: string): Observable<Page<Producto>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('sort', `${sort},${order}`);

    return this.http.get<Page<Producto>>(`${this.baseUrl}/search/${nombre}`, { params });
  }

  getAllProducts(): Observable<any> {
    return this.http.get(this.baseUrl + '/all');
  }

  getProductoById(productoId: string | number): Observable<any> {
    return this.http.get<[]>(`${this.baseUrl}/buscar/${productoId}`);
  }

  getAllProductsByNombre(nombre: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/${nombre}`);
  }

  deleteProducto(productoId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminar/${productoId}`);
  }

  get(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  create(productoDto: any) {
    return this.http.post<Producto>(`${this.baseUrl}/crear`, productoDto);
  }

  updateProducto(productoId: any, productoDto: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put<any>(`${this.baseUrl}/editar/${productoId}`, productoDto, { headers: headers });
  }

  getLowStockProductsByUserId(userId: number): Observable<Producto[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Producto[]>(`${this.baseUrl}/low-stock/${userId}`, { headers });
  }
//metodo para buscar producto por id de usuario
getProductosByNameAndUserId(nombre: string, userId: number, page: number, size: number, sort: string, order: string): Observable<Page<Producto>> {
  let params = new HttpParams();
  params = params.append('page', page.toString());
  params = params.append('size', size.toString());
  params = params.append('sort', `${sort},${order}`);

  return this.http.get<Page<Producto>>(`${this.baseUrl}/search/${nombre}/usuario/${userId}`, { params });
}
}
