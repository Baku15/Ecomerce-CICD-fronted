import { Component,  OnInit,  } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { ProductoService } from '../services/productos/producto.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module';
interface Producto {
  byteImg: string;
  // Otras propiedades del producto
    processedImg: string;
  stock: number;
  precio: number;
  descripcion: string;
  nombre:string;
  categoriaNombre:String;
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

  constructor(private productoService: ProductoService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllProductos();
    this.searchProductForm =  this.fb.group({
      title: [null, [Validators.required]]
    })
  }

  getAllProductos() {
      this.productos=[];
    this.productoService.getAllProducts().subscribe((res:Producto[]) =>{
        res.forEach((element:Producto) => {
          element.processedImg = 'data:image/jpeg;base64,'+element.byteImg;
        this.productos.push(element);

        });
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
}
