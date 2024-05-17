import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/carritoCompras/registro-carrito.service';
import { ShoppingCartDto, Respuesta } from '../model/shopping-cart.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCarts: ShoppingCartDto[] = [];
  newShoppingCart: ShoppingCartDto = { id: 0, quantity: 0, productId: 0, purchaseRecordId: 0};
  errorMessage: string | null = null;

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.getAllShoppingCarts();
  }

  getAllShoppingCarts(): void {
    this.shoppingCartService.getAllShoppingCarts().subscribe(
      (response: Respuesta) => {
        if (response.status === 'SUCCESS') {
          this.shoppingCarts = response.data;
        } else {
          this.errorMessage = 'Failed to load shopping carts';
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while loading shopping carts';
        console.error(error);
      }
    );
  }

  createShoppingCart(): void {
    this.shoppingCartService.createShoppingCart(this.newShoppingCart).subscribe(
      (response: Respuesta) => {
        if (response.status === 'SUCCESS') {
          this.getAllShoppingCarts();
          this.newShoppingCart = { id: 0, quantity: 0, productId: 0, purchaseRecordId: 0}; // Reset the form
        } else {
          this.errorMessage = 'Failed to create shopping cart';
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while creating shopping cart';
        console.error(error);
      }
    );
  }

  deleteShoppingCart(id: number): void {
    this.shoppingCartService.deleteShoppingCartById(id).subscribe(
      (response: Respuesta) => {
        if (response.status === 'SUCCESS') {
          this.getAllShoppingCarts();
        } else {
          this.errorMessage = 'Failed to delete shopping cart';
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while deleting shopping cart';
        console.error(error);
      }
    );
  }
}