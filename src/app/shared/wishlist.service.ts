import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Wishlist } from '../entity';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);


  constructor() { }

  addWishlist(wishlist: any): Observable<any> {
    return this.http.post<any>(`${this.url}wish_lists`, wishlist);
  }

  removeWishlist(wishlist: any): Observable<any> {
    return this.http.delete<any>(`${this.url}wish_lists`, wishlist);
  }
}
