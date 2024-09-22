import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { Game, User } from '../../entity';
import { UserService } from '../../shared/user.service';
import { GameService } from '../../shared/game.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import iziToast from 'izitoast';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})


export class ProfilComponent implements OnInit {

  public user: User | undefined;

  public games: Game[] = [];

  isEditing: boolean = false;

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
              timeout: 3000,
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
  
  enableEditing(): void {
    this.isEditing = !this.isEditing;
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formUpdatePseudo.controls[controlName].hasError(errorName) && this.formUpdatePseudo.controls[controlName].touched;
  }
}