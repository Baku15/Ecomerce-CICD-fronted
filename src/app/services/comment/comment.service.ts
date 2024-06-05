import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Comment } from '../../model/comment.model'; // Asegúrate de que esta ruta sea correcta
import { AuthService } from '../autenticacion/auth.service';


@Injectable({
  providedIn: 'root'
})

export class CommentService {
  private baseUrl = 'http://localhost:8040/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCommentsByProductId(productId: number): Observable<Comment[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Comment[]>(`${this.baseUrl}/comments/byProduct/${productId}`, { headers }).pipe(
      map((response: any) => response.result), // Asegúrate de que se devuelva el array de comentarios
      catchError(this.handleError)
    );
  }

  addComment(comment: Comment): Observable<Comment> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Comment>(`${this.baseUrl}/comments`, comment, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status === 401) {
        errorMessage = 'No autorizado.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 500 && error.error.message === 'El usuario ya ha comentado sobre este producto.') {
        errorMessage = 'Solo puedes agregar un mensaje por producto.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}
