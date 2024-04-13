import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private salesDataService: SalesDataService) {}

  ngOnInit() {
    this.salesDataService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  addToCart(product: Product) {
    this.salesDataService.addToCart(product);
  }
}
