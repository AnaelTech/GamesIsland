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

interface ApiResponse {
  'hydra:member': WishList[];  // 'hydra:member' est un tableau de WishList
}

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
        console.log('User info:', this.user);
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

  
  addGameToWishlist(): void {
    if (this.user && this.game) {
      console.log('User and game are defined. Proceeding to fetch wishlists...');
      
      this.wishlistService.getAllWishlists().subscribe({
        next: (response: ApiResponse) => {
          console.log('Received wishlist data:', response);
          
          const userWishlist = response['hydra:member'].find(
            (w: WishList) => this.user && w.user === this.user['@id']);  // Trouver la wishlist de l'utilisateur
          
          if (userWishlist) {
            console.log('Wishlist found for user:', userWishlist);
            
            // Vérifier si le jeu est déjà dans la wishlist
            const gameAlreadyInWishlist = userWishlist.games.includes(this.game!['@id']);
            console.log('Game already in wishlist:', gameAlreadyInWishlist);
            
            if (gameAlreadyInWishlist) {
              console.warn('This game is already in the wishlist');
              this.isInWishlist = true;
              console.log(userWishlist.games);
              return;  // Ne pas ajouter le jeu s'il est déjà dans la wishlist
            } else {
              userWishlist.user = '/api/users/' + this.user!.id;
              userWishlist.games.push(this.game!['@id']);
              // Maintenant on met à jour la wishlist avec son ID
              this.wishlistService.updateWishlist(userWishlist).subscribe({
                next: () => {
                  console.log('Game added to wishlist');
                  console.log(userWishlist.games);
                  this.isInWishlist = true;
                },
                error: (err) => {
                  console.error('Failed to update wishlist', err);
                }
              });
            }
          } else {
            // Créer une nouvelle wishlist si l'utilisateur n'en a pas
            const wishlist: WishList = {
              user: '/api/users/' + this.user!.id, 
              games: [this.game!['@id']],
              createdAt: new Date(),
            };
            this.wishlistService.addWishlist(wishlist).subscribe({
              next: (data) => {
                console.log('Wishlist created:', data);
                this.isInWishlist = true;
              },
              error: (err) => console.error('Failed to create wishlist', err)
            });
          }
        },
        error: (err) => console.error('Failed to fetch wishlists', err)
      });
    } else {
      console.warn('User or game is undefined');
    }
  }
  
  
  
  removeGameFromWishlist(): void {
    if (this.user && this.game) {
      console.log('User and game are defined. Proceeding to fetch wishlists...');
      
      this.wishlistService.getAllWishlists().subscribe({
        next: (response: ApiResponse) => {
          console.log('Received wishlist data:', response);
          
          const userWishlist = response['hydra:member'].find(
            (w: WishList) => this.user && w.user === this.user['@id']);  // Trouver la wishlist de l'utilisateur
          
          if (userWishlist) {
            console.log('Wishlist found for user:', userWishlist);
            
            // Vérifier si le jeu est dans la wishlist
            const gameInWishlist = userWishlist.games.includes(this.game!['@id']);
            console.log('Game in wishlist:', gameInWishlist);
            
            if (gameInWishlist) {
              // Supprimer le jeu de la wishlist
              userWishlist.games = userWishlist.games.filter((gameId) => gameId !== this.game!['@id']);
              
              userWishlist.user = '/api/users/' + this.user!.id;
              // Maintenant on met à jour la wishlist avec son ID
              this.wishlistService.updateWishlist(userWishlist).subscribe({
                next: () => {
                  console.log('Game removed from wishlist');
                  console.log(userWishlist.games);
                  this.isInWishlist = false;  // On met à jour l'état pour indiquer que le jeu n'est plus dans la wishlist
                },
                error: (err) => {
                  console.error('Failed to update wishlist', err);
                }
              });
            } else {
              console.warn('This game is not in the wishlist');
              console.log(userWishlist.games);
            }
          } else {
            console.warn('No wishlist found for user');
          }
        },
        error: (err) => console.error('Failed to fetch wishlists', err)
      });
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
