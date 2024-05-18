import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesProductoComponent } from './ordenes-producto.component';

describe('OrdenesProductoComponent', () => {
  let component: OrdenesProductoComponent;
  let fixture: ComponentFixture<OrdenesProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdenesProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
