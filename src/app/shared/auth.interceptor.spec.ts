import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let next: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // Créez un spy pour HttpHandlerFn
    next = jasmine.createSpy('next').and.callFake((req: HttpRequest<any>) => {
      // Retournez une réponse HttpResponse avec les en-têtes de la requête interceptée
      return of(new HttpResponse({ status: 200, body: {}, headers: req.headers }));
    });
  });

  afterEach(() => {
    // Réinitialise les cookies après chaque test pour éviter les effets de bord
    Object.defineProperty(document, 'cookie', {
      get: () => '',
      configurable: true,
    });
  });

  it('devrait ajouter un en-tête Authorization si le token est présent', (done) => {
    // Simule la présence du cookie avec le token
    Object.defineProperty(document, 'cookie', {
      get: () => 'BEARER=test-token',
      configurable: true,
    });

    const req = new HttpRequest('GET', '/test');
    authInterceptor(req, next).subscribe((event) => {
      // Vérifie que le gestionnaire `next` a été appelé
      expect(next).toHaveBeenCalled();

      // Récupère la requête interceptée passée à `next`
      const interceptedReq: HttpRequest<any> = next.calls.mostRecent().args[0];

      // Vérifie que l'en-tête Authorization a été ajouté correctement
      expect(interceptedReq.headers.has('Authorization')).toBeTrue();
      expect(interceptedReq.headers.get('Authorization')).toBe('Bearer test-token');
      done();
    });
  });

  it('ne devrait pas ajouter d\'en-tête Authorization si le token est absent', (done) => {
    // Simule l'absence du cookie avec le token
    spyOnProperty(document, 'cookie', 'get').and.returnValue('');

    const req = new HttpRequest('GET', '/test');
    authInterceptor(req, next).subscribe((event) => {
      // Vérifie que le gestionnaire `next` a été appelé
      expect(next).toHaveBeenCalled();

      // Récupère la requête interceptée passée à `next`
      const interceptedReq: HttpRequest<any> = next.calls.mostRecent().args[0];

      // Vérifie que l'en-tête Authorization n'a pas été ajouté
      expect(interceptedReq.headers.has('Authorization')).toBeFalse();
      done();
    });
  });

  it('devrait définir l\'en-tête Content-Type pour les requêtes PATCH', (done) => {
    // Simule la présence du cookie avec le token
    spyOnProperty(document, 'cookie', 'get').and.returnValue('BEARER=test-token');

    const req = new HttpRequest<any>('PATCH', '/test', {
      headers: new HttpHeaders(),
    });
    authInterceptor(req, next).subscribe((event) => {
      // Vérifie que le gestionnaire `next` a été appelé
      expect(next).toHaveBeenCalled();

      // Récupère la requête interceptée passée à `next`
      const interceptedReq: HttpRequest<any> = next.calls.mostRecent().args[0];

      // Vérifie que l'en-tête Content-Type a été défini correctement
      expect(interceptedReq.headers.get('Content-Type')).toBe('application/merge-patch+json');
      // Vérifie également que l'en-tête Authorization a été ajouté
      expect(interceptedReq.headers.get('Authorization')).toBe('Bearer test-token');
      done();
    });
  });
});
