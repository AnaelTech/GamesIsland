import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiListResponse, Game } from '../entity';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  getGames(search?: string):Observable<ApiListResponse<Game>> {
    let params = new HttpParams();
    if (search){
      params = params.append('title', search);
    }
    return this.http.get<ApiListResponse<Game>>(this.url + 'games', {params});
  }

  getGame(id: string): Observable<Game> {
    return this.http.get<Game>(this.url + 'games/' + id);
  }
}
