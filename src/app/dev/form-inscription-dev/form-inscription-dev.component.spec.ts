import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInscriptionDevComponent } from './form-inscription-dev.component';

describe('FormInscriptionDevComponent', () => {
  let component: FormInscriptionDevComponent;
  let fixture: ComponentFixture<FormInscriptionDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInscriptionDevComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInscriptionDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
