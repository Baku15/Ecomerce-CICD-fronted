import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Respuesta, ShoppingCartDto } from '../../model/shopping-cart.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8080/api/shopping-cart';

  constructor(private http: HttpClient) { }

  createShoppingCart(shoppingCartDto: ShoppingCartDto): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.apiUrl}/create`, shoppingCartDto)
      .pipe(
        catchError(this.handleError)
      );
  }

  getShoppingCartById(id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllShoppingCarts(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}/all`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteShoppingCartById(id: number): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    throw error;
  }
}