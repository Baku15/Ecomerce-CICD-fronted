export interface Sale {
  id: number;
  cantidad: number;
  fechaVenta: Date;
  precio: number;
  productoId: number;
  usuarioId: number;
  productoNombre: string; // Asegúrate de que este campo esté presente
}
