import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { CookieService } from './cookie.service';
import { Token, User } from '../entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrlLogin;
  private apiUrl = environment.apiUrl;
  private urlme = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private user: User | null = null;
  private cookieService = inject(CookieService); 

  constructor() {}

  login(credentials: any): Observable<Token> {
    return this.http.post<Token>(this.url, credentials, { withCredentials: true }).pipe(
      tap((token) => {
        this.cookieService.setCookie('BEARER', token.token, 7); 
      }),
      catchError((error) => {
        return throwError(() => new Error('Erreur lors de la connexion'));
      })
    );
  }

  isLoggedIn(): Observable<any> {
    const token = this.cookieService.getCookie('BEARER'); 
    if (token) {
      return this.http.get<any>(`${this.urlme}me`, { withCredentials: true });
    } else {
      return of(null); 
    }
  }

  getUserInfo(): Observable<any> {
    const token = this.cookieService.getCookie('BEARER'); 
    
    if (!token) {
      console.error('Token JWT manquant');
      return throwError(() => new Error('Token JWT manquant'));
    }

    return this.http.get<any>(`${this.urlme}me`, { withCredentials: true }).pipe(
      tap((user) => {
        this.user = user;
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
        return throwError(() => new Error('Erreur lors de la récupération des informations utilisateur'));
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    console.log(token, newPassword);
    return this.http.post(`${this.apiUrl}reset-password`, { token, newPassword });
  }
  

  logout() {
    this.user = null;
    this.cookieService.deleteCookie('BEARER'); // Utilisation de ngx-cookie-service pour supprimer le cookie
  }
}
