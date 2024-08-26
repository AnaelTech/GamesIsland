import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-form-inscription',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './form-inscription.component.html',
  styleUrl: './form-inscription.component.css'
})
export class FormInscriptionComponent implements OnInit {

private router: Router = inject(Router);
private userService: UserService = inject(UserService);

public formInscription: FormGroup = new FormGroup({
  username: new FormControl('', [Validators.required]),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required]),
  passwordConfirmation: new FormControl('', [Validators.required])
}, { validators: this.passwordsMatchValidator() });

public errorMessage: string = '';

constructor() {}

ngOnInit(): void {}

Inscription(){
  if (this.formInscription.valid) {
    this.userService.addUser(this.formInscription.value).subscribe({
      next: () => {
        console.log('Inscription réussie');
        this.router.navigate(['/connexion']);
      },
      error: (error) => {
        console.log('Erreur de connexion', error);
        this.formInscription.reset();
      }
    });
  } else {
    this.errorMessage = 'Veuillez remplir correctement le formulaire';
    console.log('Formulaire invalide');
    this.formInscription.reset();
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

hasError(controlName: string, errorName: string): boolean {
  return this.formInscription.controls[controlName].hasError(errorName) && this.formInscription.controls[controlName].touched;
}
}
