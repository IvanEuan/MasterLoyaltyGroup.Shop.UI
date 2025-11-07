import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  public save(token: string): void {
    localStorage.setItem('token', token);
  }

  public remove(): void {
    localStorage.removeItem('token');
  }

  public get(): string {
   return localStorage.getItem('token') ?? '';
  }
}
