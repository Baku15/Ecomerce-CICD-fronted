
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarcaService } from '../../services/marca/marca.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { Component, Injectable } from '@angular/core';

Component({
  selector: 'app-lista-marcas',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './lista-marcas.component.html',
  styleUrl: './lista-marcas.component.css'
})
interface Marca {
  byteImg: string;
  // Otras propiedades del producto
    processedImg: string;
  descripcion: string;
  nombre:string;
}
@Injectable()
export class ListaMarcasComponent {
  marca: Marca[] = [];
  products: any[] = [];
  searchProductForm!: FormGroup;
  image: Blob | undefined;

  constructor(
    private marcaService: MarcaService,
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
      this.marca=[];
    this.marcaService.getAllMarcas().subscribe((res:Marca[]) =>{
        res.forEach((element:Marca) => {
          element.processedImg = 'data:image/jpeg;base64,'+element.byteImg;
        this.marca.push(element);

        });
      console.log(this.marca)
    })
  }

// deleteProducto(productoId: any) {
//   this.productoService.deleteProducto(productoId).subscribe(
//     () => {
//       this.snackBar.open('Producto eliminado correctamente', 'Cerrar', {
//         duration: 5000,
//       });
//       // this.router.navigateByUrl('/admin/registro-producto');
//         this.getAllProductos();
//     },
//     error => {
//       console.error('Error deleting product:', error);
//       this.snackBar.open('No se pudo eliminar el Producto', 'Cerrar', {
//         duration: 5000,
//         panelClass: 'error-snackbar'
//       });
//     }
//   );
// }}
}
