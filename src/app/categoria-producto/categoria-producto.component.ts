import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material-module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasService } from '../services/categorias/categorias.service';

@Component({
  selector: 'app-categoria-producto',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule],
  templateUrl: './categoria-producto.component.html',
  styleUrl: './categoria-producto.component.css'
})
export class CategoriaProductoComponent implements OnInit {

  categoriaForm!: FormGroup;  // Añadir '!' para indicar que la propiedad será inicializada en el constructor

  constructor(
    public fb: FormBuilder,
    public categoriaService: CategoriasService ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      estado: [true, [Validators.required]]
    }); }

  guardar(): void {
    if (this.categoriaForm.valid) {
      console.log(this.categoriaForm.value);
    } else {
      alert('Por favor complete el formulario correctamente');
    }
  }

}
