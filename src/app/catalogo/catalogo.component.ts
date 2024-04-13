import { Component } from '@angular/core';
import { ProductoService } from '../services/productos/producto.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent {
  products = [];

  constructor(private ProductoService: ProductoService) { }

  ngOnInit() {
    this.ProductoService.getAllProducts().subscribe(data => {
      this.products = data;
    }, error => {
      console.error('Error fetching products:', error);
    });
  }
}
