import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiListResponse, WishList } from '../entity';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  // Créer une nouvelle wishlist
  addWishlist(wishlist: WishList): Observable<WishList> {
    return this.http.post<WishList>(`${this.url}wish_lists`, wishlist);
  }

  // Supprimer une wishlist par son ID
  removeWishlist(wishlist: WishList): Observable<void> {
    return this.http.delete<void>(`${this.url}wish_lists/${wishlist.id}`);
  }

  // Récupérer toutes les wishlists
  getAllWishlists(): Observable<ApiListResponse<WishList>> {
    return this.http.get<ApiListResponse<WishList>>(`${this.url}wish_lists`);
  }

  // Récupérer une wishlist par son ID
  getWishlistById(id: number): Observable<WishList> {
    return this.http.get<WishList>(`${this.url}wish_lists/${id}`);
  }

  // Mettre à jour une wishlist existante
  updateWishlist(wishlist: WishList): Observable<WishList> {
    return this.http.put<WishList>(`${this.url}wish_lists/${wishlist.id}`, wishlist);
  }
}
