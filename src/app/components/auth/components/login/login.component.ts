import { Component, inject } from '@angular/core';
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
  private readonly tokenStorageKey = 'authToken';

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  isSubmitting = false;

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
            const token = this.extractToken(response.data);
            if (token) {
              this.saveToken(token);
            }

            this.feedbackType = 'success';
            this.feedbackMessage = response.message || 'احراز هویت با موفقیت انجام شد';
            this.loginForm.reset();
          } else {
            this.clearStoredToken();
            this.feedbackType = 'error';
            this.feedbackMessage = response.message || 'در فرآیند ورود مشکلی پیش آمد.';
          }
        },
        error: () => {
          this.clearStoredToken();
          this.feedbackType = 'error';
          this.feedbackMessage = 'در ارتباط با سرور مشکلی رخ داده است. لطفاً دوباره تلاش کنید.';
        },
      });
  }

  clearFeedback(): void {
    this.feedbackMessage = '';
  }

  private extractToken(data: unknown): string | null {
    if (!data) {
      return null;
    }

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const possibleToken =
        record['token'] ?? record['accessToken'] ?? record['jwtToken'] ?? record['bearerToken'];

      if (typeof possibleToken === 'string') {
        return possibleToken;
      }
    }

    return null;
  }

  private saveToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.tokenStorageKey, token);
  }

  private clearStoredToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(this.tokenStorageKey);
  }
}
