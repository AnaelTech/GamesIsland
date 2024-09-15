import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game, User, Wishlist } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';
import { GameService } from '../../shared/game.service';
import { WishlistService } from '../../shared/wishlist.service';
import { NgClass } from '@angular/common';
import { Base64 } from 'js-base64';

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

  public user: User | undefined;

  public game: Game | undefined;

  private router: Router = inject(Router);

  private route: ActivatedRoute = inject(ActivatedRoute);

  public isInWishlist: boolean = false;

  constructor() { 
    
  }


  ngOnInit(): void {
    this.getUser();
    this.getIdurl();
  }

  getUser() {
    this.auth.getUserInfo().subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
  } 

  getIdurl() {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        const id = Base64.decode(encodedId);
        this.gameService.getGame(id).subscribe((data: Game) => {
          this.game = data;
        });
      }
    });
  }

  checkWishlist() {
    if (this.user && this.game) {
      this.user.wishLists.forEach(wl => {
        if (wl.game.id === this.game?.id) {
          this.isInWishlist = true;
        }
      });
  }
}

  addWishlist() {
    if (this.user && this.game?.id) {
      if (this.isInWishlist) {
        this.isInWishlist = false;
      } else {
        const wishlist = {
          user: `/api/users/${this.user.id}`, 
          games: [`/api/games/${this.game.id}`], 
          like: true
        };
  
        this.wishlistService.addWishlist(wishlist).subscribe({
          next: (data: any) => {
            console.log('Wishlist added:', data);
            this.isInWishlist = true;
          },
          error: (err) => {
            console.error('Failed to add wishlist', err);
          }
        });
      }
    } else {
      console.warn('User or game ID is not available');
    }
  }

  removeWishlist() {
    if (this.user && this.game?.id) {
      if (this.isInWishlist) {
        const wishlist = {
          user: `/api/users/${this.user.id}`, // Assuming `user.id` is the correct identifier
          games: [`/api/games/${this.game.id}`], // Assuming `games` is the field in your API
          like: false
        };

        this.wishlistService.removeWishlist(wishlist).subscribe({
          next: (data: any) => {
            console.log('Wishlist removed:', data);
            this.isInWishlist = false;
          },
          error: (err) => {
            console.error('Failed to remove wishlist', err);
          }
        });
      }
    } else {
      console.warn('User or game ID is not available');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
