import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  // Méthode pour définir un cookie
  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Expiration en jours
    const expires = "expires=" + date.toUTCString();
    const cookieValue = `${name}=${value};${expires};path=/;`; // Ajouter Secure si HTTPS
  
    document.cookie = cookieValue;
  
    // console.log('Cookie défini:', cookieValue);  // Ajoutez cette ligne pour vérifier
  }
  

  // Méthode pour récupérer un cookie
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  // Méthode pour supprimer un cookie
  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
