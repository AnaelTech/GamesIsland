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

ngOnInit(): void {

}

Login() {
  if (this.formLogin.valid) {
    this.auth.login(this.formLogin.value).subscribe({
      next: () => {
        if (this.auth.isLoggedIn()) {
          console.log('Connexion réussie');
          this.router.navigate(['/']);
        } else {
          console.log('Erreur de connexion');
          this.router.navigate(['/connexion']);
        }
        this.formLogin.reset();
      },
      error: (error) => {
        console.log('Erreur de connexion', error);
        this.router.navigate(['/connexion']);
        this.formLogin.reset();
      },
    });
  } else {
    console.log('Formulaire invalide');
    this.router.navigate(['/connexion']);
    this.formLogin.reset();
  }
}

}