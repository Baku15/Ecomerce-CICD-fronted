import { CarritoService } from '../services/carritoCompras/carrito.service';
import { RegistroCarritoService } from '../services/carritoCompras/registro-carrito.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { MaterialModule } from '../../material-module';
//import { ProductoService } from '../../services/productos/producto.service';
//primero esto
interface carritoComprasDTO {
  id: number;
  cantidad: number;
  productoID: number;
  registroCompraID: number;
}
//segundo esto
interface registroDTO {
  id: number;
  fechaCommpra: Date;
  usuarioId: number;
  itemsCarrito: carritoComprasDTO[];
}
@Component({
  selector: 'app-carrito-registro-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css'],
  standalone: true,
  imports: [CommonModule],
})
// Define la clase del componente
export class CarritoComprasComponent {
  productosCarrito: any[] = [];

  realizarCompra() {}

  constructor(
    private carritoService: CarritoService,
    private registroCarritoService: RegistroCarritoService
  ) {}

  // De carrito Service
  // Método para obtener los productos del carrito
  obtenerProductosCarrito() {
    return this.carritoService.obtenerTodosLosCarritos();
  }

  // Método para agregar un producto al carrito
  agregarProductoCarrito(registroDTO: registroDTO) {
    this.carritoService.crearCarritoCompras(registroDTO);
  }

  // Método para eliminar un producto del carrito
  eliminarProductoCarrito(registroDTOID: registroDTO['id']) {
    this.carritoService.eliminarCarritoPorId(registroDTOID);
  }
  //De carrito Registro Service
}

// Exporta la clase del componente
export default CarritoComprasComponent;
