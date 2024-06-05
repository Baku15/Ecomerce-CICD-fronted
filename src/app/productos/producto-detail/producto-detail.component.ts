import { Component, OnInit } from '@angular/core';
import { Producto } from '../../model/producto.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/productos/producto.service';
import { AuthService } from '../../services/autenticacion/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from '../../services/comment/comment.service';
import { Comment } from '../../model/comment.model'; // Asegúrate de que esta ruta sea correcta
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-producto-detail',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './producto-detail.component.html',
  styleUrl: './producto-detail.component.css'
})

export class ProductoDetailComponent implements OnInit {
  producto!: Producto;
  comments: Comment[] = [];
  commentForm!: FormGroup;
  ratings: number[] = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private commentService: CommentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const productIdParam = this.route.snapshot.paramMap.get('id');
    const productId = productIdParam ? +productIdParam : 0;
    this.loadProducto(productId);
    this.loadComments(productId);

    this.commentForm = this.fb.group({
      comentario: ['', Validators.required],
      puntuacion: [5, Validators.required]
    });
  }

  loadProducto(id: number) {
    this.productoService.getProductoById(id).subscribe(
      producto => this.producto = producto,
      error => console.error('Error al cargar el producto:', error)
    );
  }

  loadComments(productId: number) {
    this.commentService.getCommentsByProductId(productId).subscribe(
      comments => this.comments = comments,
      error => console.error('Error al cargar los comentarios:', error)
    );
  }

  submitComment() {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        id: 0,
        comentario: this.commentForm.get('comentario')!.value,
        fechaComentario: new Date(),
        puntuacion: this.commentForm.get('puntuacion')!.value,
        id_user: this.authService.getUserId(),
        id_producto: this.producto.id,
        userName: this.authService.getUsername()
      };

      this.commentService.addComment(newComment).subscribe(
        comment => {
          this.comments.push(comment);
          this.snackBar.open('Comentario agregado con éxito', 'Cerrar', { duration: 3000 });
          this.commentForm.reset({ comentario: '', puntuacion: 5 });
        },
        error => {
          this.snackBar.open(error, 'Cerrar', { duration: 3000 });
        }
      );
    }
  }
}
