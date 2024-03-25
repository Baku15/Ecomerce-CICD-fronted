import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../services/productos/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);

  form?: FormGroup;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id){
        this.productoService.get(parseInt(id))
            .subscribe(producto => {
              this.form = this.fb.group({
                  nombre: [producto.id, [Validators.required]],
                  descripcion:[producto.nombre,[Validators.required]],
                  precio:[producto.descripcion,[Validators.required]],
                  stock:[producto.stock,[Validators.required]],
                  urlimg:[producto.precio,[Validators.required]],
          });
       })

    } else{

      this.form = this.fb.group({
                  nombre: ["", [Validators.required]],
                  descripcion:["",[Validators.required]],
                  precio:["",[Validators.required]],
                  stock:["",[Validators.required]],
                  urlimg:["",[Validators.required]],

      });
    }
  }
create (){
    const producto = this.form!.value;
    this.productoService.create(producto)
        .subscribe(() => {
            this.router.navigate(['registro-producto'])
      });
  }

}

