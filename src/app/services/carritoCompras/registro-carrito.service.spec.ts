import { TestBed } from '@angular/core/testing';

import { RegistroCarritoService } from './registro-carrito.service';

describe('RegistroCarritoService', () => {
  let service: RegistroCarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroCarritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
