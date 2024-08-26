import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DeveloperService } from '../../shared/developer.service';

@Component({
  selector: 'app-form-inscription-dev',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './form-inscription-dev.component.html',
  styleUrls: ['./form-inscription-dev.component.css']
})
export class FormInscriptionDevComponent implements OnInit {
  private router: Router = inject(Router);
  private devService: DeveloperService = inject(DeveloperService);
  
  public formInscriptionDev: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    studioName: new FormControl('', [Validators.required]),
    website: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    passwordConfirmation: new FormControl('', [Validators.required]),
    roles: new FormControl(['ROLE_DEVELOPER'])
  }, { validators: this.passwordsMatchValidator() });
  
  public errorMessage: string = '';
  public isSubmitting: boolean = false; // Pour gérer l'état de soumission

  constructor() {}

  ngOnInit(): void {}

  InscriptionDev() {
    if (this.formInscriptionDev.valid) {
      this.isSubmitting = true; // Désactive le bouton de soumission
      this.devService.addDeveloper(this.formInscriptionDev.value).subscribe({
        next: () => {
          console.log('Inscription réussie');
          this.router.navigate(['/connexion']);
        },
        error: (error) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Erreur lors de la tentative d\'inscription. Veuillez réessayer.';
        },
        complete: () => {
          this.isSubmitting = false; // Réactive le bouton de soumission
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir correctement le formulaire';
      console.log('Formulaire invalide');
      this.markAllControlsAsTouched(); // Marque tous les contrôles comme touchés pour afficher les erreurs
    }
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const passwordConfirmation = formGroup.get('passwordConfirmation')?.value;

      return password === passwordConfirmation ? null : { passwordsMismatch: true };
    };
  }

  // private emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
  //   return this.devService.checkEmailNotTaken(control.value).pipe(
  //     map(isTaken => (isTaken ? { emailTaken: true } : null)),
  //     catchError(() => null) // Gérer les erreurs HTTP
  //   );
  // }

  hasError(controlName: string, errorName: string): boolean {
    return this.formInscriptionDev.controls[controlName].hasError(errorName) && this.formInscriptionDev.controls[controlName].touched;
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.formInscriptionDev.controls).forEach(controlName => {
      this.formInscriptionDev.controls[controlName].markAsTouched();
    });
  }
}
