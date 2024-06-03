import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ShoppingCart } from '../../model/shopping-cart.model';
import { ProductoService } from '../productos/producto.service';
import { Producto } from '../../model/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private baseUrl = 'http://localhost:8040/api/shopping-cart';

  constructor(private http: HttpClient, private productoService: ProductoService) {}

  getAllCarts(): Observable<ShoppingCart[]> {
    return this.http.get<ShoppingCart[]>(`${this.baseUrl}/all`).pipe(
      mergeMap((carts: ShoppingCart[]) => {
        return this.productoService.getAllProducts().pipe(
          map((productos: Producto[]) => {
            return carts.map(cart => {
              cart.producto = productos.find(p => p.id === cart.productId);
              return cart;
            });
          })
        );
      })
    );
  }

  deleteCartById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addToCart(cart: ShoppingCart): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.baseUrl}/create`, cart);
  }

  createShoppingCart(cartItem: ShoppingCart): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.baseUrl}/create`, cartItem);
  }

  getShoppingCartsByUserId(userId: number): Observable<ShoppingCart[]> {
    return this.http.get<ShoppingCart[]>(`${this.baseUrl}/user/${userId}`);
  }

  deleteShoppingCartById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

   realizarCompra(userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/checkout?userId=${userId}`, {});
  }
}
