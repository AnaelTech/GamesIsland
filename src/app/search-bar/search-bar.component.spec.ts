import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { SearchService } from '../shared/search.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  // Ajout du CommonModule si nécessaire

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let searchService: SearchService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule, SearchBarComponent],  // Importation du composant autonome
      providers: [SearchService, { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  // Vérifie la création du composant
  });

  it('should have an input element', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement).toBeTruthy();  // Vérifie la présence de l'élément input
  });

  it('should call onSearch method when input value changes', () => {
    spyOn(component, 'onSearch');
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.onSearch).toHaveBeenCalled();  // Vérifie que la méthode onSearch a été appelée
  });

  it('should update searchResultsList when search is successful', () => {
    const mockResponse = { 'hydra:member': [{ id: 1, title: 'Test Game' }] };
    spyOn(searchService, 'searchGamesByTitle').and.returnValue(of(mockResponse));
    component.searchQuery = 'test';
    component.onSearch();
    fixture.detectChanges();
    expect(component.searchResultsList).toEqual(mockResponse['hydra:member']);
  });

  it('should handle search error', () => {
    spyOn(searchService, 'searchGamesByTitle').and.returnValue(throwError('error'));
    component.searchQuery = 'test';
    component.onSearch();
    fixture.detectChanges();
    expect(component.searchResultsList).toEqual([]);  // Vérifie la gestion de l'erreur et la réinitialisation des résultats
  });

  it('should navigate to detail page on goToDetail', () => {
    component.goToDetail(1);
    expect(router.navigate).toHaveBeenCalledWith(['/home/games/' + btoa('1')]);  // Vérifie la navigation vers la page de détail
  });
});
