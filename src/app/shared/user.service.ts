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
  constructor() { }

  getUser(): Observable<User> {
    const id = this.getUserId();
    return this.http.get<User>(this.url + 'users/' + id);
  }

  getUserId() {
    const token = this.auth.token();
    if (token) {
      const tokenPayload: any = jwtDecode(token);
      const userId = tokenPayload.id;
      return userId;
    }
  }

  addUser(user:any) {
    return this.http.post(this.url + 'users', user);
  }
}
