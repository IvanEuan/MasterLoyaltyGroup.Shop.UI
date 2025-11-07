import { HttpInterceptorFn } from '@angular/common/http';
import {TokenService} from '../services/token-service';
import {inject} from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const token = tokenService.get();

  if (!token || token.trim().length == 0) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
