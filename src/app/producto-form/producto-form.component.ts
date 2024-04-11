import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../services/productos/producto.service';
import { MaterialModule } from '../material-module';
import { File } from 'buffer';
import { CategoriasService } from '../services/categorias/categorias.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {

productoForm!: FormGroup;
listOfCategorias: any=[];
selectedFile?: File | null;
imagePreview?: string | ArrayBuffer | null;

constructor(
  private fb: FormBuilder,
  private categoriaService: CategoriasService,
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
nombre: [null,[Validators.required]],
descripcion: [null,[Validators.required]],
precio: [null,[Validators.required]],
stock: [null,[Validators.required]],

    });
    this.getAllCategorias();
  }
  getAllCategorias(){
    this.categoriaService.getAllCategorias().subscribe(res=>{
    this.listOfCategorias = res;
    })
  }
  create():void{

  }
}

//   productoForm!: FormGroup;
//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id){
//         this.productoService.get(parseInt(id))
//             .subscribe(producto => {
//               this.productoForm = this.fb.group({
//                   nombre: [producto.id, [Validators.required]],
//                   descripcion:[producto.nombre,[Validators.required]],
//                   // precio:[producto.descripcion,[Validators.required]],
//                   precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
//
//                   stock:[producto.stock,[Validators.required]],
//                   urlimg:[producto.precio,[Validators.required]],
//           });
//        })
//
//     } else{
//
//       this.productoForm = this.fb.group({
//                   nombre: ["", [Validators.required]],
//                   descripcion:["",[Validators.required]],
//                   precio:["",[Validators.required]],
//                   stock:["",[Validators.required]],
//                   urlimg:["",[Validators.required]],
//
//       });
//     }
//   }
// create (){
//     const producto = this.productoForm!.value;
//     this.productoService.create(producto)
//         .subscribe(() => {
//             this.router.navigate(['registro-producto'])
//       });
//   }
//
//   onFileSelected(event:any){
//
//
//   }
//
// }
//
