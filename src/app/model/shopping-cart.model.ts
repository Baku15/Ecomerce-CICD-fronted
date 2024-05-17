export interface ShoppingCartDto {
    // Define las propiedades según tu Dto en el backend
    id: number;
    quantity: number;
    productId: number;
    purchaseRecordId: number;
  }
  
  export interface Respuesta {
    status: string;
    data: any;
  }