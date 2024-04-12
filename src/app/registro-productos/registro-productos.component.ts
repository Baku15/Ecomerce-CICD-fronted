import { Component,  OnInit,  } from '@angular/core';
import {  ReactiveFormsModule, } from '@angular/forms';
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
  image: Blob | undefined;

  constructor(private productoService: ProductoService) { }

  ngOnInit() {
    this.getAllProductos();
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
}
