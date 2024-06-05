import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../../services/comment/comment.service';
import { ProductoService } from '../../services/productos/producto.service';
import { Comment } from '../../model/comment.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material-module';


@Component({
  selector: 'app-ver-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './ver-comentarios.component.html',
  styleUrl: './ver-comentarios.component.css'
})

export class VerComentariosComponent implements OnInit {
  comments: Comment[] = [];
  productoId: number = 0;
  productoNombre: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.productoId = +this.route.snapshot.paramMap.get('productoId')!;
    this.loadProducto(this.productoId);
    this.loadComments(this.productoId);
  }

  loadProducto(productoId: number): void {
    this.productoService.getProductoById(productoId).subscribe(
      producto => this.productoNombre = producto.nombre,
      error => console.error('Error al cargar el producto:', error)
    );
  }

  loadComments(productoId: number): void {
    this.commentService.getCommentsByProductId(productoId).subscribe(
      comments => {
        this.comments = comments;
      },
      error => {
        console.error('Error al cargar los comentarios:', error);
        this.errorMessage = error;
      }
    );
  }
}
