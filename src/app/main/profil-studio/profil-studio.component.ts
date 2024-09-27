import { Component, inject, OnInit } from '@angular/core';
import { ApiListResponse, Developer, Game } from '../../entity';
import { DeveloperService } from '../../shared/developer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../shared/game.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-profil-studio',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profil-studio.component.html',
  styleUrl: './profil-studio.component.css'
})
export class ProfilStudioComponent implements OnInit {

  public developer: Developer | undefined;

  public games: Game[] = [];

  private router: Router = inject(Router);

  private developerService: DeveloperService = inject(DeveloperService);

  private http: HttpClient = inject(HttpClient);

  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() { }


  ngOnInit(): void {
    this.getPseudoUrl();
  }


  getPseudoUrl(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.developerService.getDeveloper(id).subscribe((data: Developer) => {
        this.developer = data;
        if (this.developer){
          this.getGamesByUri();
        }
        //console.log(this.developer);
      });
    }
  }

  getGamesByUri(){
    // si this.developer.games est défini, on récupère les uri des jeux de la propriété games de l'objet developer et on les récupère avec le service GameService
    if (this.developer?.games){
     this.developer?.games.forEach(game => {
      this.http.get<Game>('http://localhost:8000' + game).subscribe((data: Game) => {
        this.games.push(data);
        console.log(this.games);
      });
     });
  }
}

goToDetail(id: number | undefined) {
  const encodedId = Base64.encode(String(id));
  this.router.navigate(['/home/games/' + encodedId]);
}

}