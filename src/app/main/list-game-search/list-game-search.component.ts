import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { User, Game, ApiListResponse } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { GameService } from '../../shared/game.service';
import { UserService } from '../../shared/user.service';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-list-game-search',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './list-game-search.component.html',
  styleUrl: './list-game-search.component.css'
})
export class ListGameSearchComponent implements OnInit {
  private auth: AuthService = inject(AuthService);

  private userService: UserService = inject(UserService);

  private gameService: GameService = inject(GameService);

  public user: User | undefined;

  private router: Router = inject(Router);

  public games: Game[] = [];

  public gamesByGenre: { [key: string]: Game[] } = {};

  constructor() { 
    
  }


  ngOnInit(): void {
    this.getUser();
    this.getGames();
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

  goToDetail(id: number | undefined) {
    const encodedId = Base64.encode(String(id));
    this.router.navigate(['/home/games/' + encodedId]);
  }

  getGames() {
    this.gameService.getGames().subscribe((response: ApiListResponse<Game>) => {
      this.games = response['hydra:member'];
      console.log(this.games);
      this.gamesByGenre = this.sortGamesByGenre(this.games);
      console.log(this.gamesByGenre);
    });
  }

  sortGamesByGenre(games: Game[]): { [key: string]: Game[] } {
    const sortedGames: { [key: string]: Game[] } = {};

    games.forEach(game => {
      const genre = game.genre;
      if (!sortedGames[genre]) {
        sortedGames[genre] = [];
      }
      sortedGames[genre].push(game);
    });

    return sortedGames;
  }

}