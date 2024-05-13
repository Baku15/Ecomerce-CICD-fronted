import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { MarcaService } from '../../services/marca/marca.service';

@Component({
  selector: 'app-marca',
  standalone: true,
  imports: [RouterModule,MaterialModule,ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.css'
})
export class MarcaComponent {
  marcaForm!: FormGroup;  // Añadir '!' para indicar que la propiedad será inicializada en el constructor
  categorias: any;
selectedFile?: File | null;
imagePreview?: string | ArrayBuffer | null;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public marcaService: MarcaService

  ) {}

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
    this.marcaForm = this.fb.group({
      marca: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      // estado: [true, [Validators.required]]
    }); }

  guardar(): void {
   if (this.marcaForm.valid) {
    const formData: FormData = new FormData();
    formData.append('marca', this.marcaForm.get('marca')?.value);
    formData.append('descripcion', this.marcaForm.get('descripcion')?.value);
    // Check if selectedFile is defined before appending
        if (this.selectedFile) {
      const blob = this.selectedFile as Blob;
      formData.append('imagen', blob, this.selectedFile.name);
    }
    this.marcaService.createMarca(formData).subscribe((res)=>{
        if(res.id != null){
          this.snackBar.open("Marca creada correctamente", 'Close',{
            duration: 5000
          });
        this.router.navigateByUrl('/admin/lista-productos');
        }else {
          this.snackBar.open('error al crear la marca', 'ERROR',{
        duration: 5000
          });
        }
      })

    }else {
      for(const i in this.marcaForm.controls){
      this.marcaForm.controls[i].markAsDirty();
        this.marcaForm.controls[i].updateValueAndValidity();
      }
    }
  }

      }



