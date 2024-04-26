import { CarritoService } from '../services/carritoCompras/carrito.service';
import { RegistroCarritoService } from '../services/carritoCompras/registro-carrito.service';

interface  registroDTO{
    id: number;
    fechaCommpra: Date;
    usuarioId: number;
    itemsCarrito: carritoComprasDTO[];
}
interface  carritoComprasDTO{
    id: number;
    cantidad: number;
    productoID: number;
    registroCompraID: number;
}

// Define la clase del componente
class CarritoComprasComponent {
    constructor(private carritoService: CarritoService, private registroCarritoService: RegistroCarritoService) {}

    // De carrito Service
    // Método para obtener los productos del carrito
    obtenerProductosCarrito() {
        return this.carritoService.obtenerTodosLosCarritos();
    }

    // Método para agregar un producto al carrito
    agregarProductoCarrito(registroDTO: registroDTO) {
        this.carritoService.crearCarritoCompras(registroDTO);
    }

    // Método para eliminar un producto del carrito
    eliminarProductoCarrito(registroDTOID: registroDTO["id"]) {
        this.carritoService.eliminarCarritoPorId(registroDTOID);
    }
    //De carrito Registro Service

}

// Exporta la clase del componente
export default CarritoComprasComponent;