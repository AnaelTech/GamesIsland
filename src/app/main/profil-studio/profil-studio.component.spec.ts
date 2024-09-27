import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilStudioComponent } from './profil-studio.component';

describe('ProfilStudioComponent', () => {
  let component: ProfilStudioComponent;
  let fixture: ComponentFixture<ProfilStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilStudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
