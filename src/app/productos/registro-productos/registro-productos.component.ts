import { Component,  OnInit,  } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material-module';
import { ProductoService } from '../../services/productos/producto.service';
interface Producto {
  byteImg: string;
  // Otras propiedades del producto
    id: number;
    processedImg: string;
  stock: number;
  precio: number;
  descripcion: string;
  nombre:string;
  categoriaNombre:String;
  marcaNombre: String;
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
  products: any[] = [];
  searchProductForm!: FormGroup;
  image: Blob | undefined;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllProductos();
    this.searchProductForm =  this.fb.group({
      title: [null, [Validators.required,Validators.pattern('^[a-zA-Z]+$')]]
    })
  }

  getAllProductos() {
      this.productos=[];
    this.productoService.getAllProducts().subscribe((res:Producto[]) =>{
        res.forEach((element:Producto) => {
          element.processedImg = 'data:image/jpeg;base64,'+element.byteImg;
        this.productos.push(element);

        });
      console.log(this.productos)
    })
  }

  submitForm(){
      this.productos = [];
    const title = this.searchProductForm.get('title')!.value;
        this.productoService.getAllProductsByNombre(title).subscribe((res:Producto[]) => {
      res.forEach((element:Producto) => {
          element.processedImg = 'data:image/jpeg;base64,'+element.byteImg;
        this.productos.push(element);
      });
      console.log(this.productos)
    })
  }
deleteProducto(productoId: any) {
  this.productoService.deleteProducto(productoId).subscribe(
    () => {
      this.snackBar.open('Producto eliminado correctamente', 'Cerrar', {
        duration: 5000,
      });
      // this.router.navigateByUrl('/admin/registro-producto');
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
}}
