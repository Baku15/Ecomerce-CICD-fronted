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
import { AuthService } from '../../services/autenticacion/auth.service';
@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule, NgIf],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})

export class ProductoFormComponent implements OnInit {
  productoForm!: FormGroup;
  listOfCategorias: any[] = [];
  listOfMarcas: any[] = [];
  selectedFile?: File | null;
  imagePreview?: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriasService,
    private marcaService: MarcaService,
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      categorias: [null, [Validators.required]],
      marca: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      precio: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      stock: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.getAllCategorias();
    this.getAllMarcas();
  }

  getAllCategorias() {
    this.categoriaService.getAllCategorias().subscribe(
      res => {
        this.listOfCategorias = res;
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  getAllMarcas() {
    this.marcaService.getAllMarcas().subscribe(
      res => {
        this.listOfMarcas = res;
      },
      error => {
        console.error('Error al obtener las marcas:', error);
      }
    );
  }

  onFileSelected(event: any) {
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

  create(): void {
    if (this.productoForm.valid) {
      const formData: FormData = new FormData();
      formData.append('categorias', this.productoForm.get('categorias')?.value.toString());
      formData.append('marca', this.productoForm.get('marca')?.value.toString());
      formData.append('nombre', this.productoForm.get('nombre')?.value);
      formData.append('descripcion', this.productoForm.get('descripcion')?.value);
      formData.append('precio', this.productoForm.get('precio')?.value.toString());
      formData.append('stock', this.productoForm.get('stock')?.value.toString());

      if (this.selectedFile) {
        const blob = this.selectedFile as Blob;
        formData.append('imageUrl', blob, this.selectedFile.name);
      }

      const userId = this.authService.getUserId(); // Obtener el ID del usuario actual
      formData.append('userId', userId.toString()); // Añadir el ID del usuario al formData

      // Mostrar los datos en consola antes de enviarlos
      console.log('Form Data antes de enviar:', {
        categorias: this.productoForm.get('categorias')?.value,
        marca: this.productoForm.get('marca')?.value,
        nombre: this.productoForm.get('nombre')?.value,
        descripcion: this.productoForm.get('descripcion')?.value,
        precio: this.productoForm.get('precio')?.value,
        stock: this.productoForm.get('stock')?.value,
        userId: userId,
        imageUrl: this.selectedFile ? this.selectedFile.name : null
      });

      this.productoService.create(formData).subscribe(
        () => {
          this.snackBar.open('Producto creado correctamente', 'Cerrar', { duration: 5000 });
          this.router.navigateByUrl('/admin/lista-productos');
        },
        error => {
          console.error('Error al crear el producto:', error);
          this.snackBar.open('Error al crear el producto', 'ERROR', { duration: 5000 });
        }
      );
    } else {
      for (const i in this.productoForm.controls) {
        this.productoForm.controls[i].markAsDirty();
        this.productoForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
