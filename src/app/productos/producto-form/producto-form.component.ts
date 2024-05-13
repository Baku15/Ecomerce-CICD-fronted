import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder,FormGroup,ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { File } from 'buffer';
import { CommonModule, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material-module';
import { CategoriasService } from '../../services/categorias/categorias.service';
import { MarcaService } from '../../services/marca/marca.service';
import { ProductoService } from '../../services/productos/producto.service';
@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule, NgIf],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {

productoForm!: FormGroup;
listOfCategorias: any=[];
listOfMarcas: any=[];
selectedFile?: File | null;
imagePreview?: string | ArrayBuffer | null;

constructor(
  private fb: FormBuilder,
  private categoriaService: CategoriasService,
  private marcaService: MarcaService,
  private productoService: ProductoService,
  private snackBar: MatSnackBar,
  private router: Router,

  // private router = inject(Router),
  // private route = inject(ActivatedRoute),
  // private productoService = inject(ProductoService)
){}
  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
    this.previewImage();

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
         precio: [null, [
      Validators.required,
      this.noRepetirCaracteres('--'),
      this.noRepetirCaracteres('++'),
      Validators.pattern('^[0-9,]*$'),
      Validators.maxLength(10)
    ]],
stock: [null,[Validators.required]],

    });
    this.getAllCategorias();
    this.getAllMarcas();
  }

  getAllCategorias() {
    this.categoriaService.getAllCategorias().subscribe(
      res => {
        console.log('Respuesta del servidor:', res);
        if (Array.isArray(res)) {
          this.listOfCategorias = res;
          console.log('Categorías recibidas:', this.listOfCategorias);
          this.productoForm.updateValueAndValidity(); // Valida el formulario después de recibir las categorías
        } else {
          console.error('Error: La propiedad "result" no es un arreglo.', res);
        }
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }
  

  noRepetirCaracteres(repetido: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value && value.includes(repetido)) {
      return { 'repetido': { value: value } };
    }
    return null;
  };
}


  getAllMarcas(){
      this.marcaService.getAllMarcas().subscribe(res=>{
      this.listOfMarcas = res;
    })


  }

create(): void {
  if (this.productoForm.valid) {
    const formData: FormData = new FormData();
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
      this.productoService.create(formData).subscribe((res)=>{
        if(res.id != null){
          this.snackBar.open("Producto creado correctamente", 'Close',{
            duration: 5000
          });
        this.router.navigateByUrl('/admin/lista-productos');
        }else {
          this.snackBar.open('error al crear el producto', 'ERROR',{
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
    mostrarAlerta = false;
  mostrarAlertaError = false;
  mostrarAlertaDelete = false;
  mostrarAlertaErrorDelete = false;
  mostrarMensajeRegistroExito() {
    this.mostrarAlerta = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }
  mostrarMensajeRegistroError() {
    this.mostrarAlertaError = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }
  mostrarMensajeDeleteExito() {
    this.mostrarAlertaDelete = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }
  mostrarMensajeDeleteError() {
    this.mostrarAlertaErrorDelete = true;
    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }
  cerrarAlerta() {
    this.mostrarAlerta = false;
    this.mostrarAlertaError = false;
    this.mostrarAlertaDelete = false;
    this.mostrarAlertaErrorDelete = false;
  }
}

