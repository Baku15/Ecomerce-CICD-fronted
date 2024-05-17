import { TestBed } from '@angular/core/testing';

import { ShoppingCartService } from '../../services/carritoCompras/registro-carrito.service';

describe('RegistroCarritoService', () => {
  let service: ShoppingCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
