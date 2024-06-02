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
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      page: [this.currentPage, [Validators.required, Validators.min(0)]],
      size: [this.pageSize, [Validators.required, Validators.min(1)]]
    });

    this.loadProductos();

    this.searchProductForm.valueChanges.pipe(
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

    if (role === 'Comprador') {
      if (title) {
        this.productoService.getProductosByName(title, page, size).subscribe(
          (res: Page<Producto>) => {
            this.productos = res.content;
            this.totalPages = res.totalPages;
          }
        );
      } else {
        this.productoService.list(page, size).subscribe(
          (res: Page<Producto>) => {
            this.productos = res.content;
            this.totalPages = res.totalPages;
          }
        );
      }
    } else {
      if (title) {
        this.productoService.getProductosByName(title, page, size).subscribe(
          (res: Page<Producto>) => {
            this.productos = res.content;
            this.totalPages = res.totalPages;
          }
        );
      } else {
        this.productoService.getProductosByUsuario(userId, page, size).subscribe(
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
    this.searchProductForm.patchValue({ page: this.currentPage, size: this.pageSize });
    this.loadProductos();
  }

  submitForm() {
    this.currentPage = this.searchProductForm.get('page')!.value;
    this.pageSize = this.searchProductForm.get('size')!.value;
    this.loadProductos();
  }

  deleteProducto(productoId: number) {
    this.productoService.deleteProducto(productoId).subscribe(() => {
      this.snackBar.open('Producto eliminado correctamente', 'Cerrar', {
        duration: 3000,
      });
      this.loadProductos();
    });
  }
}
