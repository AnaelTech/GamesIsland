import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Developer, Game, User, WishList } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';
import { GameService } from '../../shared/game.service';
import { WishlistService } from '../../shared/wishlist.service';
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
          },
          error: (err) => {
            console.error('Failed to get game', err);
          }
        });
      }
    });
  }

  
  addWishlist(): void {
    if (this.user && this.game && !this.isInWishlist) {
      const wishlist: WishList = {
        id: 0,  // Id temporaire, si besoin
        user: this.user,
        games: this.game,
        createdAt: new Date(),
      };
  
      this.wishlistService.addWishlist(wishlist).subscribe({
        next: (data: WishList) => {
          console.log('Wishlist added:', data);
          this.isInWishlist = true;
        },
        error: (err) => {
          console.error('Failed to add wishlist', err);
          console.log('Wishlist data being sent:', wishlist);
        }
      });
    }
  }
  
  removeWishlist(): void {
    if (this.user && this.game) {
      const wishlist: WishList = {
        id: 0,  // Id temporaire, si besoin
        user: this.user,
        games: this.game,
        createdAt: new Date(),
      };

      if (wishlist) {
        this.wishlistService.removeWishlist(wishlist).subscribe({
          next: () => {
            console.log('Wishlist removed');
            this.isInWishlist = false;
            if (this.user) {
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
