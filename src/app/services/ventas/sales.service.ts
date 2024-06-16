import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Sale } from '../../model/sales.model';
import { AuthService } from '../autenticacion/auth.service';
import { Producto } from '../../model/producto.interface';

@Injectable({
  providedIn: 'root'
})


export class SalesService {
  private baseUrl = 'http://localhost:8040/api/venta';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSales(): Observable<Sale[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ code: string; result: Sale[] }>(`${this.baseUrl}/all`, { headers }).pipe(
      map(response => response.result),
      catchError(this.handleError)
    );
  }

  getSalesByUserId(userId: number): Observable<Sale[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ code: string; result: Sale[] }>(`${this.baseUrl}/usuario/${userId}`, { headers }).pipe(
      map(response => response.result),
      catchError(this.handleError)
    );
  }

  getSalesByUserIdAndDateRange(userId: number, startDate: string, endDate: string): Observable<Sale[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = { startDate, endDate };
    return this.http.get<{ code: string; result: Sale[] }>(`${this.baseUrl}/usuario/${userId}/daterange`, { headers, params }).pipe(
      map(response => response.result),
      catchError(this.handleError)
    );
  }

 getSalesByUserIdAndProductId(userId: number, productId: number): Observable<Sale[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<{ code: string; result: Sale[] }>(`${this.baseUrl}/usuario/${userId}/product/${productId}`, { headers }).pipe(
    map(response => response.result),
    catchError(this.handleError)
  );
}

  getSalesByUserIdAndCategoryId(userId: number, categoryId: number): Observable<Sale[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ code: string; result: Sale[] }>(`${this.baseUrl}/usuario/${userId}/category/${categoryId}`, { headers }).pipe(
      map(response => response.result),
      catchError(this.handleError)
    );
  }

  getSaleById(id: number): Observable<Sale> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Sale>(`${this.baseUrl}/buscar/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createSale(sale: Sale): Observable<Sale> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Sale>(`${this.baseUrl}/crear`, sale, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'No autorizado.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }

  getProducts(): Observable<Producto[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ code: string; result: Producto[] }>(`${this.baseUrl}/productos`, { headers }).pipe(
      map(response => response.result),
      catchError(this.handleError)
    );
  }
}
