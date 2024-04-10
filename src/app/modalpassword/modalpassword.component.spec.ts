import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpasswordComponent } from './modalpassword.component';

describe('ModalpasswordComponent', () => {
  let component: ModalpasswordComponent;
  let fixture: ComponentFixture<ModalpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
