import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { CookieService } from '../shared/cookie.service';

@Component({
  selector: 'app-form-connexion',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './form-connexion.component.html',
  styleUrls: ['./form-connexion.component.css']
})
export class FormConnexionComponent implements OnInit {
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private cookieService: CookieService = inject(CookieService);

  public formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public errorMessage: string = '';

  ngOnInit(): void {
  }

  Login() {
    if (this.formLogin.valid) {
      this.auth.login(this.formLogin.value).subscribe({
        next: () => {
          this.auth.getUserInfo().subscribe({
            next: (user) => {
              console.log('User info: ', user);
              if (user && user.roles) {
                if (user.roles.includes('ROLE_DEVELOPER')) {
                  this.router.navigate(['/dashboard-dev']);
                } else if (user.roles.includes('ROLE_USER')) {
                  console.log('user role user');
                  this.router.navigate(['/home']);
                } else {
                  console.log('user role connexion');
                  this.router.navigate(['/connexion']);
                }
              } else {
                console.log(user);
                this.router.navigate(['/connexion']);
              }
            },
            error: () => {
              this.errorMessage = 'Erreur lors de la récupération des informations utilisateur';
              this.router.navigate(['/connexion']);
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'L\'email ou le mot de passe est incorrect';
          this.router.navigate(['/connexion']);
          this.formLogin.reset();
        },
        complete: () => {
          this.formLogin.reset();
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir correctement le formulaire';
      this.markAllControlsAsTouched();
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formLogin.controls[controlName].hasError(errorName) && this.formLogin.controls[controlName].touched;
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.formLogin.controls).forEach(controlName => {
      this.formLogin.controls[controlName].markAsTouched();
    });
  }
}
