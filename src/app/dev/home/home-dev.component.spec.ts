import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDevComponent } from './home-dev.component';

describe('HomeDevComponent', () => {
  let component: HomeDevComponent;
  let fixture: ComponentFixture<HomeDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDevComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
