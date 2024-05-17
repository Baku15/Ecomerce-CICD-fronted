import { Component,  OnInit,  } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material-module';
import { ProductoService } from '../../services/productos/producto.service';
import { debounceTime } from 'rxjs';
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
  image: Blob | undefined;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllProductos();
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

  getAllProductos() {
    this.productoService.getAllProducts().subscribe((res: Producto[]) => {
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
      this.getAllProductos();
    }
  }

  deleteProducto(productoId: any) {
    this.productoService.deleteProducto(productoId).subscribe(
      () => {
        this.snackBar.open('Producto eliminado correctamente', 'Cerrar', {
          duration: 5000,
        });
        this.getAllProductos();
      },
      error => {
        console.error('Error deleting product:', error);
        this.snackBar.open('No se pudo eliminar el Producto', 'Cerrar', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  }
}
