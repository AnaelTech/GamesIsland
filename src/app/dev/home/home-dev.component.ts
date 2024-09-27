import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiListResponse, Game, User } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';
import { Base64 } from 'js-base64';
import { GameService } from '../../shared/game.service';
import { DatePipe } from '@angular/common';
import iziToast from 'izitoast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './home-dev.component.html',
  styleUrl: './home-dev.component.css'
})
export class HomeDevComponent {
  private auth: AuthService = inject(AuthService);

  private userService: UserService = inject(UserService);

  public user: User | undefined;

  public games: Game[] = [];

  public gamesDeveloper: Game[] = [];

  private gameService: GameService = inject(GameService);

  private router: Router = inject(Router);

  constructor() { 
    
  }


  ngOnInit(): void {
    this.getNotifConnected();
    this.getUser();
    this.getGamesByDeveloper();
  }

  getUser() {
    this.auth.getUserInfo().subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  goToProfile() {
    const encodedId = Base64.encode(String(this.user?.id));
    this.router.navigate(['/home/profile/' + encodedId]);
  }

  getGamesByDeveloper() {
    this.gameService.getGames().subscribe((response: ApiListResponse<Game>) => {
      this.games = response['hydra:member'];
      
      this.gamesDeveloper = this.games.filter(game => game.developer === this.user?.['@id']);
      console.log(this.gamesDeveloper);
    });
   
  }

  getNotifConnected() {
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
}

}