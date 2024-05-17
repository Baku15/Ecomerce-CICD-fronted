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
      categoria: ['', [Validators.required]],
     descripcion: ['', [Validators.required]],
      // estado: [true, [Validators.required]]
    }); }

    guardar(): void {
  if (this.categoriaForm.valid) {
    this.categoriaService.createCategoria(this.categoriaForm.value).subscribe(
      () => {
        // Manejar la respuesta del servidor
        this.snackBar.open('Categoría creada correctamente', 'Cerrar', { duration: 5000 });
        this.router.navigateByUrl('/admin/lista-productos');
      },
      (error) => {
        // Manejar errores de la solicitud
        console.error('Error al crear la categoría:', error);
        this.snackBar.open('Error al crear la categoría', 'Cerrar', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  } else {
    // Marcar todos los campos como tocados si el formulario no es válido
    this.categoriaForm.markAllAsTouched();
  }
}
}
