import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = environment.apiUrl;  // Remplace par l'URL de ton API Symfony

  constructor(private http: HttpClient) {}

  // Recherche des jeux par leur titre
  searchGamesByTitle(title: string): Observable<any> {
    const params = new HttpParams().set('title', title);

    return this.http.get<any>(`${this.apiUrl}games`, { params });
  }
}
