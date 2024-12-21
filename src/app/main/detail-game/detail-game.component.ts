import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Developer, Game, User, Wishlist } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';
import { GameService } from '../../shared/game.service';
import { WishlistService } from '../../shared/wishlist.service';
import { NgClass } from '@angular/common';
import { Base64 } from 'js-base64';
import { DeveloperService } from '../../shared/developer.service';
import { HttpClient } from '@angular/common/http';
import { SearchBarComponent } from '../../search-bar/search-bar.component';

@Component({
  selector: 'app-detail-game',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './detail-game.component.html',
  styleUrls: ['./detail-game.component.css']  // Correction de 'styleUrl' en 'styleUrls'
})
export class DetailGameComponent implements OnInit {
  private auth: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private gameService: GameService = inject(GameService);
  private wishlistService: WishlistService = inject(WishlistService);
  private developerService: DeveloperService = inject(DeveloperService);
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public developer?: Developer; // Utilisation de l'opérateur '?' pour les types optionnels
  public user?: User;
  public game?: Game;
  public isInWishlist: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.getUser();
    this.getIdurl();
  }

  searchResults: any[] = [];

  onSearchResults(results: any): void {
    this.searchResults = results;
  }

  getUser(): void {
    this.auth.getUserInfo().subscribe({
      next: (data: User) => {
        this.user = data;
        this.checkWishlist();
      },
      error: (err) => {
        console.error('Failed to get user info', err);
      }
    });
  }

  getIdurl(): void {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        const id = Base64.decode(encodedId);
        this.gameService.getGame(id).subscribe({
          next: (data: Game) => {
            this.game = data;
            if (this.game?.developer) {
              this.getDeveloper(this.game.developer);
            }
            this.checkWishlist();
          },
          error: (err) => {
            console.error('Failed to get game', err);
          }
        });
      }
    });
  }

  checkWishlist(): void {
    if (this.user && this.game) {
      this.isInWishlist = this.user.wishLists.some(wl => wl.game?.id === this.game?.id);
    }
  }
  
  addWishlist(): void {
    if (this.user && this.game && !this.isInWishlist) {
      const wishlist: Wishlist = {
        id: 0,  // Id temporaire, si besoin
        user: this.user,
        game: this.game,
        createdAt: new Date(),
        isLike: true
      };
  
      this.wishlistService.addWishlist(wishlist).subscribe({
        next: (data: Wishlist) => {
          console.log('Wishlist added:', data);
          this.isInWishlist = true;
          this.user?.wishLists.push(data); // Mise à jour locale
        },
        error: (err) => {
          console.error('Failed to add wishlist', err);
        }
      });
    }
  }
  
  removeWishlist(): void {
    if (this.user && this.game) {
      const wishlist = this.user.wishLists.find(wl => wl.game?.id === this.game?.id);
  
      if (wishlist) {
        this.wishlistService.removeWishlist(wishlist).subscribe({
          next: () => {
            console.log('Wishlist removed');
            this.isInWishlist = false;
            if (this.user) {
            // Mise à jour locale
            this.user.wishLists = this.user?.wishLists.filter(wl => wl.id !== wishlist.id);
            }
          },
          error: (err) => {
            console.error('Failed to remove wishlist', err);
          }
        });
      } else {
        console.warn('Wishlist not found for this game');
      }
    } else {
      console.warn('User or game is undefined');
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    const encodedId = Base64.encode(String(this.user?.id));
    this.router.navigate(['/home/profile/' + encodedId]);
  }

  getDeveloper(uri: string): void {
    this.http.get<Developer>('http://localhost:8000' + uri).subscribe({
      next: (data: Developer) => {
        this.developer = data;
      },
      error: (err) => {
        console.error('Failed to get developer', err);
      }
    });
  }

  goToProfileDeveloper(id: number | undefined): void {
    this.router.navigate(['/home/profile-studio/' + id]);
  }
}
