import { Component, inject } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../services/productos/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  form = this.fb.group({
      nombre:['',[Validators.required]],
      descripcion:['',[Validators.required]],
      precio:['',[Validators.required]],
      stock:['',[Validators.required]],
      urlimg:['',[Validators.required]],
  });
create (){
    const producto = this.form.value;
    this.productoService.create(producto)
        .subscribe(() => {
            this.router.navigate(['registro-producto'])
      });
  }

}

