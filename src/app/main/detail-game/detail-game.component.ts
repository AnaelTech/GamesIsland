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

@Component({
  selector: 'app-detail-game',
  standalone: true,
  imports: [NgClass],
  templateUrl: './detail-game.component.html',
  styleUrl: './detail-game.component.css'
})
export class DetailGameComponent implements OnInit {
  private auth: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private gameService: GameService = inject(GameService);
  private wishlistService: WishlistService = inject(WishlistService);
  private developerService: DeveloperService = inject(DeveloperService);
  private http : HttpClient = inject(HttpClient);

  public developer: Developer | undefined;
  public user: User | undefined;
  public game: Game | undefined;
  public isInWishlist: boolean = false;

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
    this.getUser();
    this.getIdurl();
  }

  getUser() {
    this.auth.getUserInfo().subscribe((data: User) => {
      this.user = data;
      if (this.game) {
        this.checkWishlist();
      }
    });
  }

  getIdurl() {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        const id = Base64.decode(encodedId);
        this.gameService.getGame(id).subscribe((data: Game) => {
          this.game = data;
          if (this.game?.developer) {
            this.getDeveloper(this.game.developer);
          }
          if (this.user) {
            this.checkWishlist();
          }
        });
      }
    });
  }

  checkWishlist() {
    if (this.user && this.game) {
      this.isInWishlist = this.user.wishLists.some(wl => wl.game?.id === this.game?.id);
    }
  }

  addWishlist() {
    if (this.user && this.game && !this.isInWishlist) {
      const wishlist: Wishlist = {
        id: 0,  // Id temporaire
        user: this.user,
        game: this.game,
        createdAt: new Date(),
        isLike: true
      };

      this.wishlistService.addWishlist(wishlist).subscribe({
        next: (data: Wishlist) => {
          console.log('Wishlist added:', data);
          this.isInWishlist = true;
        },
        error: (err) => {
          console.error('Failed to add wishlist', err);
        }
      });
    }
  }

  removeWishlist() {
    if (this.user && this.game) {
      const wishlist = this.user.wishLists.find(wl => wl.game?.id === this.game?.id);

      if (wishlist) {
        this.wishlistService.removeWishlist(wishlist).subscribe({
          next: () => {
            console.log('Wishlist removed');
            this.isInWishlist = false;
          },
          error: (err) => {
            console.error('Failed to remove wishlist', err);
          }
        });
      } else {
        console.warn('Wishlist not found for this game');
      }
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  goToProfile() {
    const encodedId = Base64.encode(String(this.user?.id));
    this.router.navigate(['/home/profile/' + encodedId]);
  }

  getDeveloper(uri: string) {
    this.http.get<Developer>('http://localhost:8000' + uri).subscribe((data: Developer) => {
      this.developer = data;
    });
    return this.developer;
  }

  goToProfileDeveloper(id: number | undefined) {
    this.router.navigate(['/home/profile-studio/' + id]);
  }
}
