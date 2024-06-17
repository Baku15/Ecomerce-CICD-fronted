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
import { ShoppingCart } from '../../model/shopping-cart.model';
import { ShoppingCartService } from '../../services/carritoCompras/registro-carrito.service';
import { QuantityDialogComponent } from '../../quantity-dialog/quantity-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    public authService: AuthService,
    private shoppingCartService: ShoppingCartService, // Inyecta tu servicio de carrito
    private dialog: MatDialog

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

 // Escucha los cambios en el formulario para hacer las búsquedas dinámicas
  this.searchProductForm.valueChanges.pipe(
    debounceTime(300)
  ).subscribe(() => {
    this.submitForm();
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

  console.log('loadProductos called with:', { title, role, userId, page, size, sortField, sortOrder });

  if (role === 'EMPLEADO') {
    if (title) {
      this.productoService.getProductosByNameAndUserId(title, userId, page, size, sortField, sortOrder).subscribe(
        (res: Page<Producto>) => {
          console.log('API response:', res);
          this.productos = res.content;
          this.totalPages = res.totalPages;
        },
        error => {
          console.error('Error al cargar productos:', error);
          this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
        }
      );
    } else {
      this.productoService.getProductosByUsuario(userId, page, size, sortField, sortOrder).subscribe(
        (res: Page<Producto>) => {
          console.log('API response:', res);
          this.productos = res.content;
          this.totalPages = res.totalPages;
        },
        error => {
          console.error('Error al cargar productos:', error);
          this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
        }
      );
    }
  } else {
    this.productoService.list(page, size, sortField, sortOrder).subscribe(
      (res: Page<Producto>) => {
        console.log('API response:', res);
        this.productos = res.content;
        this.totalPages = res.totalPages;
      },
      error => {
        console.error('Error al cargar productos:', error);
        this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
      }
    );
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
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '250px',
    data: { id: id }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Si el usuario confirma la eliminación
      this.productoService.deleteProducto(id).subscribe(
        () => {
          this.snackBar.open('Producto eliminado con éxito', 'Cerrar', { duration: 3000 });
          this.loadProductos(); // Recargar la lista de productos después de eliminar
        },
        error => {
          console.error('Error al eliminar el producto:', error);
          this.snackBar.open('Error al eliminar el producto', 'Cerrar', { duration: 3000 });
        }
      );
    }
  });
}

    openQuantityDialog(producto: Producto): void {
    const dialogRef = this.dialog.open(QuantityDialogComponent, {
      data: { quantity: 1, stock: producto.stock }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.addToCart(producto, result);
      }
    });
  }
addToCart(producto: Producto, quantity: number): void {
    const userId = this.authService.getUserId();
    const cartItem = {
      id: 0, // Asignando un valor inicial para el id
      quantity: quantity,
      productId: producto.id,
      purchaseRecordId: 0, // Esto permitirá crear un nuevo registro de compra si no existe
      userId: userId,
      productName: producto.nombre,
      productPrice: producto.precio
    };

    this.shoppingCartService.createShoppingCart(cartItem).subscribe(
      () => {
        this.snackBar.open('Producto agregado al carrito', 'Cerrar', { duration: 3000 });
      },
      error => {
        console.error('Error al agregar al carrito:', error);
        this.snackBar.open('Error al agregar al carrito', 'Cerrar', { duration: 3000 });
      }
    );
  }

  rateProduct(id: number) {
    // Lógica para calificar el producto
  }
  commentOnProduct(id: number) {
    this.router.navigate(['/admin/comments', id]);
  }
}
