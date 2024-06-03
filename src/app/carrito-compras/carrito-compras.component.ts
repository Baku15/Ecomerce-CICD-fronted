import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/carritoCompras/registro-carrito.service';
import { ProductoService } from '../services/productos/producto.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';
import { AuthService } from '../services/autenticacion/auth.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})

export class ShoppingCartComponent implements OnInit {
  carrito: ShoppingCart[] = [];
  total: number = 0;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const userId = this.authService.getUserId();
    this.shoppingCartService.getShoppingCartsByUserId(userId).subscribe(
      (response: any) => {
        if (response.code === 'SUCCESS') {
          this.carrito = response.result; // Asignamos la propiedad 'result' que es un array
          this.calculateTotal();
        } else {
          console.error('Error al cargar el carrito:', response.message);
          this.snackBar.open('Error al cargar el carrito', 'Cerrar', { duration: 3000 });
        }
      },
      error => {
        console.error('Error al cargar el carrito:', error);
        this.snackBar.open('Error al cargar el carrito', 'Cerrar', { duration: 3000 });
      }
    );
  }

  calculateTotal(): void {
    if (Array.isArray(this.carrito)) {
      this.total = this.carrito.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
      console.log('Total: ', this.total);
    } else {
      console.error('Carrito is not an array:', this.carrito);
      this.total = 0;
    }
  }

  removeFromCart(cartItemId: number): void {
    this.shoppingCartService.deleteShoppingCartById(cartItemId).subscribe(
      () => {
        this.snackBar.open('Producto eliminado del carrito', 'Cerrar', { duration: 3000 });
        this.loadCart(); // Recargar el carrito después de eliminar un producto
      },
      error => {
        console.error('Error al eliminar del carrito:', error);
        this.snackBar.open('Error al eliminar del carrito', 'Cerrar', { duration: 3000 });
      }
    );
  }

  checkout(): void {
    // Implementar la lógica para realizar la compra
    this.snackBar.open('Compra realizada con éxito', 'Cerrar', { duration: 3000 });
  }
}

