import {CanActivateFn, Router} from '@angular/router';
import {TokenService} from '../services/token-service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.get();

  if (!token || token.trim().length == 0) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
