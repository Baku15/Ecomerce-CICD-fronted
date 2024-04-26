import { ComponentFixture, TestBed } from '@angular/core/testing';

import carritocomprasComponent from './carrito-compras.component';

describe('carritocomprasComponent', () => {
  let component: carritocomprasComponent;
  let fixture: ComponentFixture<carritocomprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [carritocomprasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(carritocomprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
