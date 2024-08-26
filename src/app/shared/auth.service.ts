import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrlLogin;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.url, credentials).pipe(
      tap((data) => {
        if (data.token) {
          this.saveToken(data.token);
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la connexion', error);
        // Ne pas sauvegarder le token si une erreur survient
        return throwError(() => new Error('Erreur lors de la connexion'));
      })
    );
  }

  getRoles() {
    const token = this.token();
    if (token) {
      const tokenPayload: any = jwtDecode(token);
      const roles = tokenPayload.roles;
      return roles;
    }
  }

  token() {
    return localStorage.getItem('token');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    const token = this.token();
    return !!token;
  }

  logout() {
    localStorage.removeItem('token');
  }
}