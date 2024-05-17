import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { File } from 'buffer';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { CategoriasService } from '../../services/categorias/categorias.service';
import { ProductoService } from '../../services/productos/producto.service';
import { MarcaService } from '../../services/marca/marca.service';
@Component({
  selector: 'app-update-producto',
  standalone: true,
  imports: [CommonModule,RouterModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './update-producto.component.html',
  styleUrl: './update-producto.component.css'
})
export class UpdateProductoComponent {
productoId = this.activatedRoute.snapshot.params['productoId'];
productoForm!: FormGroup;
listOfCategorias: any=[];
listOfMarcas: any=[];
selectedFile?: File | null;
imagePreview?: string | ArrayBuffer | null;
existingImage: string | null = null;
imgChanged = false;
constructor(
  private fb: FormBuilder,
  private categoriaService: CategoriasService,
  private productoService: ProductoService,
  private marcaService: MarcaService,
 private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,

){}

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.imgChanged = true;
    this.existingImage = null;

}
  previewImage(): void {
  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile as Blob);
  }
}

  ngOnInit(): void {
    this.productoForm = this.fb.group({

 categorias: [null,[Validators.required]],
      marca: [null,[Validators.required]],
nombre: [null,[Validators.required]],
descripcion: [null,[Validators.required]],
precio: [null,[Validators.required]],
imageUrl: [null,[Validators.required]],
stock: [null,[Validators.required]],

    });
    this.getAllCategorias();
    this.getProductoById();
    this.getAllMarcas();
  }
  getAllCategorias(){
    this.categoriaService.getAllCategorias().subscribe(res=>{
    this.listOfCategorias = res;
    })
  }

  getAllMarcas(){
    this.marcaService.getAllMarcas().subscribe(res=>{
    this.listOfMarcas = res;
    })
  }
getProductoById() {
    this.productoService.getProductoById(this.productoId).subscribe(res => {
      console.log('Respuesta del servicio getProductoById:', res);
      this.productoForm.patchValue({
        nombre: res.nombre,
        descripcion: res.descripcion,
        precio: res.precio,
        stock: res.stock,
        imageUrl: res.imageUrl,
        marca: res.id, // Asumiendo que la marca tiene una propiedad id
        categorias: res.id
      });
      this.existingImage = res.imageUrl; // Cargar la imagen existente
    });
  }



updateProduct(): void {
  if (this.productoForm.valid) {
    const formData: FormData = new FormData();
       if(this.imgChanged && this.selectedFile){
            const blob = this.selectedFile as Blob;
      formData.append('imageUrl', blob, this.selectedFile.name);
      }
    formData.append('categorias', this.productoForm.get('categorias')?.value.toString());
formData.append('marca', this.productoForm.get('marca')?.value.toString());

    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value.toString());
    formData.append('stock', this.productoForm.get('stock')?.value.toString());

    // Check if selectedFile is defined before appending
        if (this.selectedFile) {
      const blob = this.selectedFile as Blob;
      formData.append('imageUrl', blob, this.selectedFile.name);
    }

      // Llamar al servicio para actualizar el producto
    this.productoService.updateProducto(this.productoId, formData).subscribe(
      () => {
        // Manejar la respuesta del servidor
          this.snackBar.open("Producto modificado correctamente", 'Cerrar', { duration: 5000 });
          this.router.navigateByUrl('/admin/lista-productos');
        }, error => {
          this.snackBar.open('No se pudo actualizar el producto', 'Cerrar', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
    );
  } else {
    // Marcar campos inválidos si el formulario no es válido
    for (const control in this.productoForm.controls) {
      this.productoForm.get(control)?.markAsDirty();
      this.productoForm.get(control)?.updateValueAndValidity();
    }
  }
}
}
