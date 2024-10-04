import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import iziToast from 'izitoast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
private authService: AuthService = inject(AuthService);

private route: ActivatedRoute = inject(ActivatedRoute);

private router: Router = inject(Router);

public resetPasswordForm = new FormGroup({
  newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
});

token = '';

ngOnInit(): void {
  this.token = this.route.snapshot.queryParamMap.get('token') || '';
  console.log(this.token);
}

onSubmit(): void {
  if (this.resetPasswordForm.valid) {
    const newPassword = this.resetPasswordForm.value.newPassword;
    
    if (typeof newPassword === 'string') { // Vérifiez si newPassword est une chaîne
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          iziToast.success({
            title: 'Réinitialisation du mot de passe',
            message: 'Votre mot de passe a été réinitialisé avec succès.',
            position: 'topCenter',
            timeout: 3000,
            close: true,
            pauseOnHover: true,
            resetOnHover: true,
            transitionIn: 'fadeInUp',
            transitionOut: 'fadeOutDown'
          });
          this.router.navigate(['/connexion']);
        },
        error: (error) => {
          iziToast.error({
            title: 'Erreur',
            message: 'Une erreur s\'est produite lors de la réinitialisation de votre mot de passe.',
            position: 'topCenter',
            timeout: 3000,
            close: true,
            pauseOnHover: true,
            resetOnHover: true,
            transitionIn: 'fadeInUp',
            transitionOut: 'fadeOutDown'
          });
        }
      });
    }
  }
}

}
