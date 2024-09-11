import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { CookieService } from './cookie.service'; // Service de gestion des cookies
import { ApiListResponse, Token, User } from '../entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrlLogin;
  private urlme = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private user: any = null;
  private cookieService: CookieService = inject(CookieService);

  constructor() {}

  login(credentials: any): Observable<Token> {
    return this.http.post<Token>(this.url, credentials, { withCredentials: true }).pipe(
      tap((token) => {
        this.cookieService.setCookie('BEARER', token.token, 7);
        console.log('Token set dans cookie' ,token.token);
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

  getUserInfo(): Observable<User> {
    if (this.user) {
      return of(this.user);
    }
  
    return this.http.get<User>(`${this.urlme}me`, { withCredentials: true }).pipe(
      tap((user) => {
        this.user = user;
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
        return throwError(() => new Error('Erreur lors de la récupération des informations utilisateur'));
      })
    );
  }


  logout() {
    this.user = null;
    this.cookieService.deleteCookie('BEARER'); 
  }
}
