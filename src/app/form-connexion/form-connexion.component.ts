import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-form-connexion',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './form-connexion.component.html',
  styleUrl: './form-connexion.component.css'
})
export class FormConnexionComponent implements OnInit {
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  public formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  // Message d'erreur général
  public errorMessage: string = '';

  ngOnInit(): void {}

  Login() {
    if (this.formLogin.valid) {
      this.auth.login(this.formLogin.value).subscribe({
        next: () => {
          if (this.auth.isLoggedIn()) {
            console.log('Connexion réussie');
            this.router.navigate(['/home']);
          } else {
            console.log('Erreur de connexion');
            this.errorMessage = 'Email ou mot de passe incorrect';
            this.router.navigate(['/connexion']);
          }
        },
        error: (error) => {
          console.log('Erreur de connexion', error);
          this.errorMessage = 'L \'email ou le mot de passe est incorrect';
          this.router.navigate(['/connexion']);
          this.formLogin.reset();
        },
        complete: () => {
          this.formLogin.reset();
        },
      });
    } else {
      this.errorMessage = 'Veuillez remplir correctement le formulaire';
      console.log('Formulaire invalide');
      this.markAllControlsAsTouched();
    }
  }

  // Méthode pour vérifier si le champ a une erreur spécifique
  hasError(controlName: string, errorName: string): boolean {
    return this.formLogin.controls[controlName].hasError(errorName) && this.formLogin.controls[controlName].touched;
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.formLogin.controls).forEach(controlName => {
      this.formLogin.controls[controlName].markAsTouched();
    });
  }
}
