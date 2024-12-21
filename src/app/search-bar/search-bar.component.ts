import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../shared/search.service';
import { FormsModule } from '@angular/forms';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchQuery: string = '';  // Variable pour stocker la requête de recherche
  searchResultsList: any[] = [];  // Liste des résultats de recherche

  @Output() searchResults = new EventEmitter<any>();  // EventEmitter pour transmettre les résultats au parent

  constructor(private searchService: SearchService, private router: Router) {}

  // Recherche des jeux par titre
  onSearch(): void {
    if (this.searchQuery.trim().length > 0) {
      this.searchService.searchGamesByTitle(this.searchQuery).subscribe(response => {
        // Mettre à jour la liste des résultats de recherche
        this.searchResultsList = response['hydra:member']; 
        this.searchResults.emit(this.searchResultsList);
        console.log(this.searchResultsList)  // Envoie les résultats au parent si nécessaire
      }, error => {
        console.error('Erreur lors de la recherche', error);
        this.searchResultsList = [];  // En cas d'erreur, on vide les résultats
      });
    } else {
      this.searchResultsList = [];  // Si la recherche est vide, on vide les résultats
    }
  }

  goToDetail(id: number | undefined): void {
    if (id) {
      const encodedId = Base64.encode(String(id));  
      this.router.navigate(['/home/games/' + encodedId]);  
    }
  }
}
