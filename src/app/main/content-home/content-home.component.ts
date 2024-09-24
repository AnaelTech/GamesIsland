import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { ApiListResponse, Game, User } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { Router, RouterLink } from '@angular/router';
import { GameService } from '../../shared/game.service';
import { Base64 } from 'js-base64';
import iziToast from 'izitoast';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-content-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './content-home.component.html',
  styleUrl: './content-home.component.css'
})
export class ContentHomeComponent implements OnInit {

  private auth: AuthService = inject(AuthService);

  private userService: UserService = inject(UserService);

  private gameService: GameService = inject(GameService);

  public searchTerm: string = '';

  public user: User | undefined;

  public games: Game[] = [];

  private router: Router = inject(Router);
  public errorMessage: string = '';

  constructor() { 
    
  }


  ngOnInit(): void {
    this.getUser();
    this.getGames();

    if (localStorage.getItem('Connexion réussie')) {
    iziToast.success({
      title: 'Connexion réussie',
      position: 'bottomRight',
      message: 'Vous êtes maintenant connecté avec succès',
      timeout: 3000,
      progressBar: true,
      pauseOnHover: true,
  });
  localStorage.removeItem('Connexion réussie');
}

console.log(this.searchTerm);

  }


  getUser() {
    this.auth.getUserInfo().subscribe({
      next: (response) => {
        const user = response; 
        this.user = user; 
        // console.log(this.user);
      },
      error: () => {
        console.error('Erreur lors de la récupération de l\'id utilisateur');
      }
    });
  }


  getGames() {
    this.gameService.getGames().subscribe((response: ApiListResponse<Game>) => {
      this.games = response['hydra:member'];
      console.log(this.games);
    });
  }


  goToDetail(id: number | undefined) {
    const encodedId = Base64.encode(String(id));
    this.router.navigate(['/home/games/' + encodedId]);
  }

  goToProfile() {
    const encodedId = Base64.encode(String(this.user?.id));
    this.router.navigate(['/home/profile/' + encodedId]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  searchGames(search: string) {
    this.gameService.getGames(search).subscribe((response: ApiListResponse<Game>) => {
      this.games = response['hydra:member'];
    });
  }
  

}