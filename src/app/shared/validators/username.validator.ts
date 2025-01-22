// src/app/shared/validators/username.validator.ts
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { UserService } from '../user.service';

export function usernameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return userService.checkUsername(control.value).pipe(
      map(response => (response.available ? null : { usernameTaken: true })),
      catchError(() => of(null)) // Ignore errors
    );
  };
}
