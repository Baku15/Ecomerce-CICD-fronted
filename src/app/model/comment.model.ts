export interface Comment {
  id: number;
  comentario: string;
  fechaComentario: Date;
  puntuacion: number;
  id_user: number;
  id_producto: number;
  userName: string;
}
