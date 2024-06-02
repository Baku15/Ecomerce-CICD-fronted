import { Component,  OnInit,  } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material-module';
import { ProductoService } from '../../services/productos/producto.service';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../services/autenticacion/auth.service';
import { Page } from '../../model/page.model';
import { Producto } from '../../model/producto.interface';

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
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      page: [this.currentPage],
      size: [this.pageSize],
      sortField: ['id'],
      sortOrder: ['asc']
    });

    this.loadProductos();

    this.searchProductForm.get('title')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadProductos();
    });

    this.searchProductForm.get('page')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadProductos();
    });

    this.searchProductForm.get('size')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadProductos();
    });

    this.searchProductForm.get('sortField')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadProductos();
    });

    this.searchProductForm.get('sortOrder')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadProductos();
    });
  }

  loadProductos() {
    const title = this.searchProductForm.get('title')!.value;
    const role = this.authService.getRole();
    const userId = this.authService.getUserId();
    const page = this.searchProductForm.get('page')!.value;
    const size = this.searchProductForm.get('size')!.value;
    const sortField = this.searchProductForm.get('sortField')!.value;
    const sortOrder = this.searchProductForm.get('sortOrder')!.value;

    if (role === 'Comprador') {
      if (title) {
        this.productoService.getProductosByName(title, page, size, sortField, sortOrder).subscribe(
          (res: Page<Producto>) => {
            this.productos = res.content;
            this.totalPages = res.totalPages;
          }
        );
      } else {
        this.productoService.list(page, size, sortField, sortOrder).subscribe(
          (res: Page<Producto>) => {
            this.productos = res.content;
            this.totalPages = res.totalPages;
          }
        );
      }
    } else {
      if (title) {
        this.productoService.getProductosByName(title, page, size, sortField, sortOrder).subscribe(
          (res: Page<Producto>) => {
            this.productos = res.content;
            this.totalPages = res.totalPages;
          }
        );
      } else {
        this.productoService.getProductosByUsuario(userId, page, size, sortField, sortOrder).subscribe(
          (res: Page<Producto>) => {
            this.productos = res.content;
            this.totalPages = res.totalPages;
          }
        );
      }
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProductos();
  }

  submitForm() {
    this.currentPage = 0;
    this.loadProductos();
  }

  deleteProducto(id: number) {
    // Lógica para eliminar el producto
  }

  addToCart(id: number) {
    // Lógica para agregar al carrito
  }

  rateProduct(id: number) {
    // Lógica para calificar el producto
  }

  commentOnProduct(id: number) {
    // Lógica para comentar sobre el producto
  }
}
