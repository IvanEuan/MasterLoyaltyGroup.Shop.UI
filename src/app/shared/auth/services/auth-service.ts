import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {LoginResponse} from '../models/login-response.model-ts';
import {TokenService} from '../../../core/services/token-service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private httpClient = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private baseUrl = `${environment.apiUrl}/auth`;

  public login(email: string, password: string): Observable<LoginResponse> {
    const body = {email, password};
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, body);
  }

  public  logout() {
    this.tokenService.remove();
    this.router.navigateByUrl('/login');
  }

}
