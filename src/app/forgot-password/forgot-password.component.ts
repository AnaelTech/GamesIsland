import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import iziToast from 'izitoast';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

private authService: AuthService = inject(AuthService);

public formForgotPassword: FormGroup = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email])
});


onForgotPassword(): void {
  if (this.formForgotPassword.valid) {
    const email = this.formForgotPassword.get('email')?.value; // Utilisation de ?. pour gérer le cas où get pourrait renvoyer null

    if (email) {
      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          iziToast.success({
            title: 'E-mail envoyé',
            message: 'Un lien de réinitialisation de mot de passe vous a été envoyé par e-mail.',
            position: 'topCenter',
            timeout: 3000,
            close: true,
            pauseOnHover: true,
            resetOnHover: true,
            transitionIn: 'fadeInUp',
            transitionOut: 'fadeOutDown'
          });
        },
        error: (error) => {
          iziToast.error({
            title: 'Erreur',
            message: 'Veuillez vérifier votre e-mail et réessayer.',
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
