import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Developer } from '../entity';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private auth = inject(AuthService);
  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  constructor() { }

  addDeveloper(developer:any) {
    return this.http.post(this.url + 'developers', developer);
  }

  getDevelopers():Observable<Developer[]> {
    return this.http.get<Developer[]>(this.url + 'developers');
  }

  getDeveloper(id: string): Observable<Developer> {
    return this.http.get<Developer>(this.url + 'developers/' + id);
  }

}
