import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesDataService } from '../services/sales-data.service';
import { Product } from '../models/product.model'; // Asegúrate de tener esta clase definida en tu proyecto

@Component({
  selector: 'app-carritocompras',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para usar directivas como ngFor, ngIf, etc.
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class CarritoComprasComponent {
  cartItems: Product[] = [];

  constructor(private salesDataService: SalesDataService) {
    this.subscribeToCartChanges();
  }

  private subscribeToCartChanges() {
    // Suscribirse a los cambios en el carrito
    this.salesDataService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeFromCart(product: Product) {
    // Lógica para remover un producto del carrito
    this.salesDataService.removeFromCart(product);
  }

  clearCart() {
    // Limpia todos los productos del carrito
    this.salesDataService.clearCart();
  }
}
