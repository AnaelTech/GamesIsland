import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entity';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  constructor() { }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.url + 'users/' + id);
  }

  addUser(user:any) {
    return this.http.post(this.url + 'users', user);
  }

  updateUser(user:any, userId: number | undefined) {
    const headears = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json',
    });
    return this.http.patch(this.url + 'users/' + userId, user,);
  }

  deleteUser(userId: number | undefined) {
    return this.http.delete(this.url + 'users/' + userId);
  }

  checkUsername(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.url}check-username`, {
      params: { username }
    });
  }

}
