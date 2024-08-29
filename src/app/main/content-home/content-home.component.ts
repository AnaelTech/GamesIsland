import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { ApiListResponse, Game, User } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { GameService } from '../../shared/game.service';

@Component({
  selector: 'app-content-home',
  standalone: true,
  imports: [],
  templateUrl: './content-home.component.html',
  styleUrl: './content-home.component.css'
})
export class ContentHomeComponent implements OnInit {

  private auth: AuthService = inject(AuthService);

  private userService: UserService = inject(UserService);

  private gameService: GameService = inject(GameService);


  public user: User | undefined;

  public games: Game[] = [];

  private router: Router = inject(Router);

  constructor() { 
    
  }


  ngOnInit(): void {
    this.getUser();
    this.getGames();
  }

  getUser() {
    this.userService.getUser().subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
  }

  getGames() {
    this.gameService.getGames().subscribe((response: ApiListResponse<Game>) => {
      this.games = response['hydra:member']; // Access the `data` property
      console.log(this.games);
    });
  }


  goToDetail(id: number | undefined) {
    this.router.navigate(['home/games/'+id]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
