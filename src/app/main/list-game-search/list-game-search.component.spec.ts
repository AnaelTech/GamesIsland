import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGameSearchComponent } from './list-game-search.component';

describe('ListGameSearchComponent', () => {
  let component: ListGameSearchComponent;
  let fixture: ComponentFixture<ListGameSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGameSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListGameSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
