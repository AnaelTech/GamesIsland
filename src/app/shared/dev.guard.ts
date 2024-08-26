import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { map } from 'rxjs/operators';

export const devGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getRoles().pipe(
    map((roles) => {
      if (roles && roles.includes('ROLE_DEVELOPER')) {
        return true;
      } else {
        router.navigate(['/connexion']);
        return false;
      }
    })
  );
};