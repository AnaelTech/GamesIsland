import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
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
        // console.error('Erreur lors de la connexion', error);
        return throwError(() => new Error('Erreur lors de la connexion'));
      })
    );
  }

  getRoles(): Observable<string[]> {
    const token = this.token();
    if (token) {
      const tokenPayload: any = jwtDecode(token);
      return of(tokenPayload.roles || []);
    }
    return of([]);
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