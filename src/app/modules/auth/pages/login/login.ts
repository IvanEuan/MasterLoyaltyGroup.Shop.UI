import {Component, inject, OnDestroy} from '@angular/core';
import {TokenService} from '../../../../core/services/token-service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../shared/auth/services/auth-service';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';
import {ToastService} from '../../../../core/services/toast-service';
import {Image} from 'primeng/image';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputText, Password, Button, Image],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {

  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private loginSub: Subscription | undefined;
  protected submitted = false;

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20)])
  });

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {

      const email = this.loginForm.get('email')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';

      this.authService.login(email, password).subscribe(
        (resp) => {
          if (resp) {
            this.tokenService.save(resp.token);
            this.router.navigate(['/home']);
          } else {
            this.toastService.showWarn('Usuario o contraseñas incorrectas, intente de nuevo');
          }
        }
      );
      this.submitted = false;
    }
  }

  protected isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.submitted);
  }
}
