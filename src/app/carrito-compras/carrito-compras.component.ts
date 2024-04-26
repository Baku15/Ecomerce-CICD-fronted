import { CarritoService } from './services/carritoCompras/carrito.service';
import { RegistroCarritoService } from 'services/registro-carrito.service';

// Importa los servicios necesarios

// Define la clase del componente
class CarritoComprasComponent {
    constructor(private carritoService: CarritoService, private registroCarritoService: RegistroCarritoService) {}

    // Define las propiedades y métodos necesarios para el componente

    // Método para obtener los productos del carrito
    obtenerProductosCarrito() {
        return this.carritoService.obtenerProductos();
    }

    // Método para agregar un producto al carrito
    agregarProductoCarrito(producto) {
        this.carritoService.agregarProducto(producto);
    }

    // Método para eliminar un producto del carrito
    eliminarProductoCarrito(producto) {
        this.carritoService.eliminarProducto(producto);
    }

    // Método para registrar el carrito de compras
    registrarCarrito() {
        const carrito = this.carritoService.obtenerCarrito();
        this.registroCarritoService.registrarCarrito(carrito);
    }
}

// Exporta la clase del componente
export default CarritoComprasComponent;