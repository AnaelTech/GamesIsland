import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { Game, User } from '../../entity';
import { UserService } from '../../shared/user.service';
import { GameService } from '../../shared/game.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {

  public user: User | undefined;

  public games: Game[] = [];

  private route: ActivatedRoute = inject(ActivatedRoute);

  private userService: UserService = inject(UserService);

  private gameService: GameService = inject(GameService);

  

  constructor() { }

  ngOnInit(): void {
    this.getIdUser();
  }

  getIdUser(){
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        const id = Base64.decode(encodedId);
        this.userService.getUser(id).subscribe((data: User) => {
          console.log(data.wishLists);
          this.user = data;
        });
      }
    });
  }
}