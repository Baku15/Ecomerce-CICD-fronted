import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material-module';
import { CategoriasService } from '../../services/categorias/categorias.service';

@Component({
  selector: 'app-categoria-producto',
  standalone: true,
  imports: [RouterModule,MaterialModule,ReactiveFormsModule, NgFor],
  templateUrl: './categoria-producto.component.html',
  styleUrl: './categoria-producto.component.css'
})
export class CategoriaProductoComponent implements OnInit {

  categoriaForm!: FormGroup;  // Añadir '!' para indicar que la propiedad será inicializada en el constructor
  categorias: any;
  private productoService = inject(CategoriasService)

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public categoriaService: CategoriasService
  ) {}


  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required]],
     descripcion: ['', [Validators.required]],
      // estado: [true, [Validators.required]]
    }); }

    guardar(): void {
      if (this.categoriaForm.valid) {
        this.categoriaService.createCategoria(this.categoriaForm.value).subscribe((res) => {
          if (res && res.id != null) { // Comprueba si res es válido y si contiene un ID válido
            this.snackBar.open('Categoría creada correctamente', 'Cerrar', { duration: 5000 });
            this.router.navigateByUrl('/admin/lista-productos');
          } else {
            this.snackBar.open('Categoria Creada de forma correcta', 'Cerrar', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
            this.router.navigateByUrl('/admin/lista-productos');

          }
        }, error => {
          console.error('Error al crear la categoría:', error);
          this.snackBar.open('Error al crear la categoría', 'Cerrar', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        });
      } else {
        this.categoriaForm.markAllAsTouched();
    }
      }

  }


