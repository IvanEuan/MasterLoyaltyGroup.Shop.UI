import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared/auth/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    Toolbar
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private authService = inject(AuthService);
  private router = inject(Router)

  protected navigateTo(url: string){
    this.router.navigateByUrl(url);
  }

  protected logout() {
    this.authService.logout();
  }
}
