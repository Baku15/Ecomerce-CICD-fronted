import { ComponentFixture, TestBed } from '@angular/core/testing';

class EditarPerfilComponent {
}

describe('EditarPerfilComponent', () => {
  let component: EditarPerfilComponent;
  let fixture: ComponentFixture<EditarPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPerfilComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
