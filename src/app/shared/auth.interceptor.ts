import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const token = getCookie('BEARER');

  if (!token) {
    return next(req);
  }
// Ajoute le token dans les headers
  let headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,  
  });

  // Vérifiez si la méthode est PATCH
  if (req.method === 'PATCH') {
    headers = headers.set('Content-Type', 'application/merge-patch+json');
  }

  const newReq = req.clone({
    headers,
  });

  return next(newReq);
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
