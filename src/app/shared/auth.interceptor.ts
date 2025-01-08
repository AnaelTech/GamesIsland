import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const token = getCookie('BEARER');

  // Si aucun token n'est présent, passez la requête sans modification
  if (!token) {
    return next(req);
  }

  // Ajoute le token dans les headers
  let headers = req.headers.set('Authorization', `Bearer ${token}`);

  // Vérifiez si la méthode est PATCH et ajoutez l'en-tête Content-Type approprié
  if (req.method === 'PATCH') {
    headers = headers.set('Content-Type', 'application/merge-patch+json');
  }

  // Clonez la requête avec les nouveaux en-têtes
  const newReq = req.clone({ headers });

  // Passez la requête modifiée au prochain gestionnaire
  return next(newReq);
}

// Fonction utilitaire pour obtenir un cookie par son nom
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}