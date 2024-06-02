import { Component,  OnInit,  } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material-module';
import { ProductoService } from '../../services/productos/producto.service';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../services/autenticacion/auth.service';
interface Producto {
  byteImg: string;
  // Otras propiedades del producto
    id: number;
    imageUrl: string;
  stock: number;
  precio: number;
  descripcion: string;
  nombre:string;
  categorias: string;
  marca: string;
}

@Component({
  selector: 'app-registro-productos',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './registro-productos.component.html',
  styleUrl: './registro-productos.component.css'
})

export class RegistroProductosComponent implements OnInit {
productos: Producto[] = [];
  searchProductForm!: FormGroup;
  userId!: number;
  userRole!: string;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId(); // Obtener ID del usuario actual
    this.userRole = this.authService.getRole(); // Obtener rol del usuario actual
    this.loadProductos();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]]
    });

    // Aplicar debounce a la búsqueda
    this.searchProductForm.get('title')!.valueChanges
      .pipe(debounceTime(300)) // Establece un retraso de 300 ms
      .subscribe(() => {
        this.submitForm();
      });
  }

  loadProductos() {
    if (this.userRole === 'Comprador') {
      this.getAllProductos();
    } else {
      this.getProductsByUsuario();
    }
  }

  getAllProductos() {
    this.productoService.getAllProducts().subscribe((res: Producto[]) => {
      this.productos = res;
    });
  }

  getProductsByUsuario() {
    this.productoService.getProductosByUsuario(this.userId).subscribe((res: Producto[]) => {
      this.productos = res;
    });
  }

  submitForm() {
    const title = this.searchProductForm.get('title')!.value;
    if (title.trim() !== '') {
      this.productoService.getAllProductsByNombre(title).subscribe((res: Producto[]) => {
        this.productos = res;
      });
    } else {
      this.loadProductos();
    }
  }

  deleteProducto(productoId: number) {
    this.productoService.deleteProducto(productoId).subscribe(() => {
      this.snackBar.open('Producto eliminado correctamente', 'Cerrar', { duration: 5000 });
      this.loadProductos();
    }, error => {
      this.snackBar.open('Error al eliminar el producto', 'ERROR', { duration: 5000 });
    });
  }
}
