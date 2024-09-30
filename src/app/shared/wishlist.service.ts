import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiListResponse, Wishlist } from '../entity';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  // Créer une nouvelle wishlist
  addWishlist(wishlist: Wishlist): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${this.url}wish_lists`, wishlist);
  }

  // Supprimer une wishlist par son ID
  removeWishlist(wishlist: Wishlist): Observable<void> {
    return this.http.delete<void>(`${this.url}wish_lists/${wishlist.id}`);
  }

  // Récupérer toutes les wishlists
  getAllWishlists(): Observable<ApiListResponse<Wishlist>> {
    return this.http.get<ApiListResponse<Wishlist>>(`${this.url}wish_lists`);
  }

  // Récupérer une wishlist par son ID
  getWishlistById(id: number): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.url}wish_lists/${id}`);
  }

  // Mettre à jour une wishlist existante
  updateWishlist(wishlist: Wishlist): Observable<Wishlist> {
    return this.http.put<Wishlist>(`${this.url}wish_lists/${wishlist.id}`, wishlist);
  }
}
