import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { Game, User } from '../../entity';
import { UserService } from '../../shared/user.service';
import { GameService } from '../../shared/game.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import iziToast from 'izitoast';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})


export class ProfilComponent implements OnInit, AfterViewInit {

  swiper: Swiper | undefined;

  public user: User | undefined;

  public games: Game[] = [];

  public wishListGames: any[] = [];

  isEditing: boolean = false;

  private router: Router = inject(Router);

  private route: ActivatedRoute = inject(ActivatedRoute);

  private userService: UserService = inject(UserService);

  private gameService: GameService = inject(GameService);

  public formUpdatePseudo: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  });
  

  constructor() { }

  ngOnInit(): void {
    this.getIdUser();
  }

  ngAfterViewInit(): void {
    this.swiper = new Swiper('.swiper-container', {
      modules: [Navigation],
      navigation: {
        nextEl: '#slider-button-right',
        prevEl: '#slider-button-left',
      },
      slidesPerView: 'auto',
      spaceBetween: 30,
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  getIdUser(){
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        const id = Base64.decode(encodedId);
        this.userService.getUser(id).subscribe((data: User) => {
          this.user = data;
          this.loadWishlistGames();
          console.log('User info:', this.user);
        });
      }
    });
  }

  loadWishlistGames(){
    const gameUrls = this.user?.wishList.games;
    if (gameUrls) {
      gameUrls.forEach((url: string) => {
      this.gameService.getGameByUrl(url).subscribe((game: Game) => {
        this.wishListGames.push(game);
      });
    }
    )
  }
  if (this.swiper) {
    this.swiper.update();
  }
}

  updatePseudo() {
    if (this.formUpdatePseudo.valid) {
      const userId = this.user?.id;
      const userData = { username: this.formUpdatePseudo.value.username }; 
  
      if (userId) {
        this.userService.updateUser(userData, userId).subscribe({
          next: () => {
            this.isEditing = false;
            iziToast.success({
              title: 'Pseudo mis à jour',
              message: 'Votre pseudo a été mis à jour avec succès.',
              position: 'bottomRight',
              timeout: 3000,
              close: true,
            });
            if (this.user) {
              this.user.username = userData.username; 
            }
            this.formUpdatePseudo.reset();
          },
          error: (error) => {
            console.error('Erreur de connexion', error);
            iziToast.error({
              title: 'Erreur lors de la mise à jour du pseudo',
              message: 'Une erreur est survenue lors de la mise à jour du pseudo. Veuillez réessayer.',
              position: 'bottomRight',
              close: true,
            });
          }
        });
      } else {
        iziToast.error({
          title: 'Erreur de connexion',
          message: 'Une erreur est survenue lors de la mise à jour du pseudo. Veuillez réessayer.',
          position: 'bottomRight',
          timeout: 3000,
          close: true,
        });
      }
    } else {
        iziToast.error({
          title: 'Erreur de connexion',
          message: 'Veuillez remplir correctement le formulaire',
          position: 'bottomRight',
          timeout: 3000,
          close: true,
        });
    }
  }
  
  deleteAccount() {
    iziToast.question({
        title: 'Êtes-vous sûr ?',
        message: 'Vous êtes sur le point de supprimer votre compte.',
        position: 'center',
        color: 'red',
        maxWidth: 500,
        closeOnClick: true,
        buttons: [
            ['<button>Oui</button>', (instance, toast, button, event, inputs) => {
                if (this.user) {
                    this.userService.deleteUser(this.user.id).subscribe({
                        next: () => {
                            this.user = undefined;
                            this.router.navigate(['/connexion']);
                            iziToast.success({
                                title: 'Compte supprimé',
                                message: 'Votre compte a été supprimé avec succès.',
                                position: 'bottomRight',
                                timeout: 3000,
                                close: true,
                            });
                        },
                        error: (error) => {
                            console.error('Erreur de connexion', error);
                            iziToast.error({
                                title: 'Erreur lors de la suppression du compte',
                                message: 'Une erreur est survenue lors de la suppression du compte. Veuillez réessayer.',
                                position: 'bottomRight',
                                timeout: 3000,
                                close: true,
                            });
                        }
                    });
                } else {
                    iziToast.error({
                        title: 'Erreur',
                        message: 'Utilisateur non trouvé.',
                        position: 'bottomRight',
                        timeout: 3000,
                        close: true,
                    });
                }
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                return true;
            }, true],
            ['<button>Non</button>', (instance, toast, button, event, inputs) => {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                return true; 
            }, true] 
        ]
    });
}



  enableEditing(): void {
    this.isEditing = !this.isEditing;
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formUpdatePseudo.controls[controlName].hasError(errorName) && this.formUpdatePseudo.controls[controlName].touched;
  }
}