import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game, User } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';
import { GameService } from '../../shared/game.service';

@Component({
  selector: 'app-detail-game',
  standalone: true,
  imports: [],
  templateUrl: './detail-game.component.html',
  styleUrl: './detail-game.component.css'
})
export class DetailGameComponent implements OnInit {
  private auth: AuthService = inject(AuthService);

  private userService: UserService = inject(UserService);

  private gameService: GameService = inject(GameService);

  public user: User | undefined;

  public game: Game | undefined;

  private router: Router = inject(Router);

  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() { 
    
  }


  ngOnInit(): void {
    this.getUser();
    this.getIdurl();
  }

  getUser() {
    this.userService.getUser().subscribe((data: User) => {
      this.user = data;
      // console.log(this.user);
    });
  } 

  getIdurl(){
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.gameService.getGame(id).subscribe((data: Game) => {
      this.game = data;
      console.log(this.game);
    });

  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
