import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { MarcaService } from '../../services/marca/marca.service';

@Component({
  selector: 'app-marca',
  standalone: true,
  imports: [RouterModule,MaterialModule,ReactiveFormsModule, NgFor],
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.css'
})
export class MarcaComponent {
  marcaForm!: FormGroup;  // Añadir '!' para indicar que la propiedad será inicializada en el constructor
  categorias: any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public marcaService: MarcaService
  ) {}


  ngOnInit(): void {
    this.marcaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      // estado: [true, [Validators.required]]
    }); }

  guardar(): void {
    if(this.marcaForm.valid){
      this.marcaService.createMarca(this.marcaForm.value).subscribe((res)=>{
        if (res.id != null){
          this.snackBar.open('caegoria creada de forma correcta', 'close',{
            duration: 5000
          });
          this.router.navigateByUrl('/admin/lista-productos');
        }else{
          this.snackBar.open('error al crear categoria','close',{
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      })

    }else {
        this.marcaForm.markAllAsTouched();
    }
      }

  }


