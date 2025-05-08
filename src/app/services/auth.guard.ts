import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  return authService.currentUser.pipe(
    map(user => {
      if (user && user.roles && requiredRoles.every(role => user.roles.includes(role))) {
        return true;
      } else {
        // Redirect to login or unauthorized page
        router.navigate(['/login']); // Or a dedicated unauthorized page
        return false;
      }
    })
  );
};
