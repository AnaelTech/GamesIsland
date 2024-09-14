import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entity';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = inject(AuthService);
  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private userInfos: AuthService = inject(AuthService);
  constructor() { }

  getUser(): Observable<User> {
    const id = this.getUserId();
    return this.http.get<User>(this.url + 'users/' + id);
  }

  getUserId() {
    this.auth.getUserInfo().subscribe({
      next: (response) => {
        const user = response;
        if (user && user.id) {
          const userId = user.id;
          return userId;
        }
        else {
         return console.error('Erreur lors de la récupération de l\'id utilisateur');
        }
      },
      error: () => {
        console.error('Erreur lors de la récupération de l\'id utilisateur');
      }
    });
  }

  addUser(user:any) {
    return this.http.post(this.url + 'users', user);
  }
}
