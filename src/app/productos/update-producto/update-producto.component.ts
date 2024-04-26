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
marcaId = this.activatedRoute.snapshot.params['marcaId'];
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

  // private router = inject(Router),
  // private route = inject(ActivatedRoute),
  // private productoService = inject(ProductoService)
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
      categoriaId: [null,[Validators.required]],
      marcaId: [null,[Validators.required]],
nombre: [null,[Validators.required]],
descripcion: [null,[Validators.required]],
precio: [null,[Validators.required]],
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

getProductoById(){
   this.productoService.getProductoById(this.productoId).subscribe(res=>{
      this.productoForm.patchValue(res);
      this.existingImage= 'data:image/jpeg;base64,' + res.byteImg;
    })
  }
updateProduct(): void {
  if (this.productoForm.valid) {
    const formData: FormData = new FormData();
       if(this.imgChanged && this.selectedFile){
            const blob = this.selectedFile as Blob;
      formData.append('img', blob, this.selectedFile.name);
      }
    formData.append('categoriaId', this.productoForm.get('categoriaId')?.value.toString());
formData.append('marcaId', this.productoForm.get('marcaId')?.value.toString());

    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value.toString());
    formData.append('stock', this.productoForm.get('stock')?.value.toString());

    // Check if selectedFile is defined before appending
        if (this.selectedFile) {
      const blob = this.selectedFile as Blob;
      formData.append('img', blob, this.selectedFile.name);
    }
      this.productoService.updateProducto(this.productoId,formData).subscribe((res)=>{
        if(res.id != null){
          this.snackBar.open("Producto modificado correctamente", 'Close',{
            duration: 5000
          });
        this.router.navigateByUrl('/admin/lista-productos');
        }else {
          this.snackBar.open('error al modificar el producto', 'ERROR',{
        duration: 5000
          });
        }
      })

    }else {
      for(const i in this.productoForm.controls){
      this.productoForm.controls[i].markAsDirty();
        this.productoForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
