export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imageUrl: string; // URL de la imagen del producto
  categorias: string[]; // Lista de nombres de categorías
  marca: string; // Nombre de la marca
  usuarios: number[]; // Lista de IDs de usuarios asociados
  descuento: number[]; // Lista de IDs de descuentos asociados
  byteImg?: string; // Cadena Base64 de la imagen, si es necesario
  processedImg?: string; // Imagen procesada, si es necesario
}
