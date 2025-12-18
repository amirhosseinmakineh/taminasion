import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { AuthResponse } from '../../../../models/auth/auth-response.model';
import { LoginRequest } from '../../../../models/auth/login-request.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    isBusinessOwner: [false],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

  constructor() {
    const navigationState = this.consumeNavigationState();

    if (navigationState?.errorMessage) {
      this.feedbackType = 'error';
      this.feedbackMessage = navigationState.errorMessage;
    } else if (navigationState?.infoMessage) {
      this.feedbackType = 'info';
      this.feedbackMessage = navigationState.infoMessage;
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload: LoginRequest = this.loginForm.getRawValue();
    this.isSubmitting = true;
    this.feedbackMessage = '';

    this.authService
      .login(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response: AuthResponse<unknown>) => {
          if (response.isSuccess) {
            this.feedbackType = 'success';
            this.feedbackMessage = response.message || 'احراز هویت با موفقیت انجام شد';
            this.loginForm.reset();
            void this.router.navigate(['/admin-dashboard']);
          } else {
            this.authService.clearStoredToken();
            this.feedbackType = 'error';
            this.feedbackMessage = response.message || 'در فرآیند ورود مشکلی پیش آمد.';
          }
        },
        error: () => {
          this.authService.clearStoredToken();
          this.feedbackType = 'error';
          this.feedbackMessage = 'در ارتباط با سرور مشکلی رخ داده است. لطفاً دوباره تلاش کنید.';
        },
      });
  }

  clearFeedback(): void {
    this.feedbackMessage = '';
  }

  private consumeNavigationState(): { errorMessage?: string; infoMessage?: string } | null {
    const navigation = this.router.getCurrentNavigation();
    const stateFromNavigation = (navigation?.extras?.state as
      | { errorMessage?: string; infoMessage?: string }
      | undefined) ?? null;

    let state = stateFromNavigation;

    if (!state && typeof window !== 'undefined') {
      state = (window.history.state as { errorMessage?: string; infoMessage?: string } | null) ?? null;
    }

    if (state && typeof window !== 'undefined' && typeof window.history?.replaceState === 'function') {
      const { errorMessage, infoMessage, ...rest } = state;
      window.history.replaceState(rest, typeof document !== 'undefined' ? document.title : '');
    }

    return state;
  }
}
