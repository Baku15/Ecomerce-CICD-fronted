import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../services/productos/producto.service';

@Component({
  selector: 'app-registro-productos',
  standalone: true,
  imports: [],
  templateUrl: './registro-productos.component.html',
  styleUrl: './registro-productos.component.css'
})
export class RegistroProductosComponent implements OnInit {

  private productoService = inject(ProductoService);
  productos: any[] = [];
  ngOnInit(): void {
      this.productoService.list()
        .subscribe((productos: any) => {
        this.productos = productos;
      });

    // this.productoForm = this.fb.group({
    //     nombre : ['',Validators.required],
    //     descripcion : ['',Validators.required],
    //     precio : ['',Validators.required],
    //     stock : ['',Validators.required],
    //     urlimg : ['',Validators.required],

    // })
  }
    guardar():void{
  }
}
