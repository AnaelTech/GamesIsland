import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { map } from 'rxjs/operators';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserInfo().pipe(
    map((user) => {
      if (user && user.roles) {
        if (user.roles.includes('ROLE_USER')) {
          return true;
          } else {
          router.navigate(['/connexion']);
          return false;
        }
      } else {
        router.navigate(['/connexion']);
        return false;
      }
    })
    );
};
