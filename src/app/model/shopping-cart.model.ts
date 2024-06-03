import { Producto } from './producto.interface';

export interface ShoppingCart {
  id: number;
  quantity: number;
  productId: number;
  purchaseRecordId: number;
  producto?: Producto; // Agregar el campo producto opcionalmente
    userId: number;
    productName: string;
  productPrice: number;

}

